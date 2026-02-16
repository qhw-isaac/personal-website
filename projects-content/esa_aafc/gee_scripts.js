/*
 * Google Earth Engine Scripts for Land Cover Analysis
 * Project: ESA WorldCover vs AAFC Annual Crop Inventory - British Columbia
 * Author: Isaac Qi
 * 
 * This file contains all GEE JavaScript code used for:
 * 1. AAFC data extraction and export
 * 2. ESA WorldCover data extraction and export
 * 3. Fraser Valley regional analysis
 * 4. District-level land cover area calculations
 */

// =============================================================================
// Data Sources and Global Variables
// =============================================================================

// Load data collections
var aafc = ee.ImageCollection('AAFC/ACI');
var worldcover = ee.ImageCollection('ESA/WorldCover/v200');
var boundaries = ee.FeatureCollection('FAO/GAUL/2015/level2');
var admin2 = ee.FeatureCollection('FAO/GAUL/2015/level2');

// =============================================================================
// AAFC BC District-Level Analysis
// =============================================================================

// Get AAFC classification for 2021
var classification = ee.Image(
  aafc.filter(ee.Filter.date('2021-01-01', '2022-01-01')).first()
);

// Extract class names and values
var classNames = classification.get('landcover_class_names');
var classValues = ee.List(
  classification.get('landcover_class_values')
).map(function(v) {
  return ee.Number(v).format('%d');
});

// Create dictionary mapping class codes to names
var classDict = ee.Dictionary.fromLists(classValues, classNames);

// Filter for British Columbia districts
var bcDistricts = boundaries.filter(
  ee.Filter.eq('ADM1_NAME', 'British Columbia / Colombie-Britannique')
);

// Function to compute land cover area by class for each district
var computeClassArea = function(feature) {
  var grouped = ee.Image.pixelArea()
    .addBands(classification)
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'class'
      }),
      geometry: feature.geometry(),
      scale: 10,
      maxPixels: 1e10
    });

  var classList = ee.List(grouped.get('groups'));

  var kvPairs = classList.map(function(item) {
    item = ee.Dictionary(item);
    var classCode = ee.Number(item.get('class')).format('%d');
    var area = ee.Number(item.get('sum')).round();
    return ee.List([classDict.get(classCode), area]);
  });

  return ee.Feature(
    feature.geometry(),
    ee.Dictionary(kvPairs.flatten())
      .set('district', feature.get('ADM2_NAME'))
  );
};

// Calculate areas for all BC districts
var districtAreas = bcDistricts.map(computeClassArea);

var outputFields = classDict.values().cat(['district']);

Map.addLayer(districtAreas);

// Export BC district-level AAFC data to Drive
Export.table.toDrive({
  collection: districtAreas,
  description: 'BC_Class_Areas_AAFC',
  fileNamePrefix: 'BC_Class_Areas_AAFC',
  fileFormat: 'CSV',
  selectors: outputFields.getInfo()
});

// =============================================================================
// AAFC Fraser Valley Export
// =============================================================================

// Select Fraser Valley borders
var selected = admin2.filter(ee.Filter.eq('ADM2_CODE', 12550));
var geometry = selected.geometry();
Map.centerObject(geometry);
Map.addLayer(geometry, {}, "FV Border");

// Filter AAFC data for 2021
var filtered_2021 = aafc.filter(ee.Filter.date('2021-01-01', '2022-01-01'));
var classification = ee.Image(filtered_2021.first());

// Clip to Fraser Valley and mask
var clipped = classification
  .clip(geometry)
  .selfMask();
  
Map.addLayer(clipped, {}, "AAFC FV");

// Export Fraser Valley AAFC image
Export.image.toDrive({
  image: clipped, 
  description: 'Export_Image_unVisualized_FV_AAFC',
  fileNamePrefix: 'FV_unVisualized_AAFC',
  region: geometry,
  scale: 10,
  maxPixels: 1e10
});

// =============================================================================
// ESA WorldCover Fraser Valley Export
// =============================================================================

// Select Fraser Valley borders
var fv_borders = boundaries.filter(ee.Filter.eq('ADM2_CODE', 12550));

// Create geometry and center map
var geometry = fv_borders.geometry();
Map.centerObject(geometry);
Map.addLayer(geometry, {}, "FV Border");

// Filter and extract WorldCover image for Fraser Valley
print(worldcover);
var filtered_2021 = worldcover.filter(ee.Filter.date('2021-01-01', '2022-01-01'));
var classification = ee.Image(filtered_2021.first());

// Clip to Fraser Valley
var clipped = classification
  .clip(geometry)
  .selfMask();
  
Map.addLayer(clipped, {}, "WorldCover FV");

// Export Fraser Valley WorldCover image
Export.image.toDrive({
  image: clipped,
  description: 'FV_ESA',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
});

// =============================================================================
// ESA WorldCover BC District-Level Analysis
// =============================================================================

// Get WorldCover classification for 2021
var filtered = worldcover.filter(ee.Filter.date('2021-01-01', '2022-01-01'));
var classification = ee.Image(filtered.first());

// Build class code to class name dictionary
var classNames = classification.get('Map_class_names');
var classValues = classification.get('Map_class_values');

classValues = ee.List(classValues).map(function(item) {
  return ee.Number(item).format();
});

var classDict = ee.Dictionary.fromLists(classValues, classNames);

// Select BC region boundaries
var selected = boundaries.filter(
  ee.Filter.eq('ADM1_NAME', 'British Columbia / Colombie-Britannique')
);

// Function to compute area (km²) by class for each district
var calculateClassArea = function(feature) {
  var areas = ee.Image.pixelArea().addBands(classification)
    .reduceRegion({
      reducer: ee.Reducer.sum().group({
        groupField: 1,
        groupName: 'Class'
      }),
      geometry: feature.geometry(),
      scale: 10,
      maxPixels: 1e10
    });

  var classAreas = ee.List(areas.get('groups'));
  var classAreaLists = classAreas.map(function(item) {
    var areaDict = ee.Dictionary(item);
    var classNumber = ee.Number(areaDict.get('Class')).format();
    var area = ee.Number(areaDict.get('sum')).divide(1e6).round(); // Convert to km²
    return ee.List([classDict.get(classNumber), area]);
  });

  var result = ee.Dictionary(classAreaLists.flatten());
  var district = feature.get('ADM2_NAME');

  return ee.Feature(feature.geometry(), result.set('district', district));
};

// Calculate areas for all BC districts
var admin2Areas = selected.map(calculateClassArea);

var outputFields = classDict.values().cat(['district']);

Map.addLayer(admin2Areas);

// Export BC district-level WorldCover data to Drive
Export.table.toDrive({
  collection: admin2Areas,
  description: 'BC_Class_Areas',
  fileNamePrefix: 'BC_Class_Areas_ADMN2',
  fileFormat: 'CSV',
  selectors: outputFields.getInfo()
});

// =============================================================================
// End of Script
// =============================================================================
