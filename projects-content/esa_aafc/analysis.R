# Land Cover Analysis in British Columbia
# ESA WorldCover vs AAFC Annual Crop Inventory
# Author: Isaac Qi

# =============================================================================
# Setup and Configuration
# =============================================================================

# Load required libraries
library(stargazer)
library(tidyverse)
library(sf)
library(terra)
library(scales)
library(knitr)
library(kableExtra)
library(raster)
library(here)
library(rnaturalearth)
library(bcmaps)

# Set options
options(scipen = 999)

# =============================================================================
# ESA WorldCover Analysis - Fraser Valley
# =============================================================================

# Load the Fraser Valley visualized image
fv_rast <- rast("data/FV_transparent.tif")

# ESA WorldCover color scheme and labels
landcover_classes <- tribble(
  ~Value, ~Color, ~Description,
  10, "#006400", "Tree cover",
  20, "#ffbb22", "Shrubland",
  30, "#ffff4c", "Grassland",
  40, "#f096ff", "Cropland",
  50, "#fa0000", "Built-up",
  60, "#b4b4b4", "Bare / sparse vegetation",
  70, "#f0f0f0", "Snow and ice",
  80, "#0064c8", "Permanent water bodies",
  90, "#0096a0", "Herbaceous wetland",
  95, "#00cf75", "Mangroves",
  100, "#fae6a0", "Moss and lichen"
)

# Drop black pixels (no data)
fv_rast[fv_rast == 0] <- NA

# Plot Fraser Valley WorldCover map with legend
layout(matrix(c(1, 2), nrow = 1), widths = c(2, 1.5))

plot(fv_rast, 
     col = landcover_classes$Color,
     main = "Fraser Valley District - ESA WorldCover")

plot.new()
legend(x = 0.05, y = 0.95, 
       legend = landcover_classes$Description,
       fill = landcover_classes$Color,
       border = "black",
       title = "Land Cover Classes",
       cex = 1.2,
       bty = "o")

# =============================================================================
# Load and Process WorldCover Data
# =============================================================================

worldcover_data <- read_csv(here("data", "worldcover.csv"), show_col_types = FALSE) %>%
  rename(District = district) %>%
  dplyr::select(District, everything())

worldcover_data[is.na(worldcover_data)] <- 0

# Extract Fraser Valley data
fraser_valley <- worldcover_data %>%
  filter(District == "Fraser Valley")

# Display Fraser Valley area statistics
print("Fraser Valley Land Cover Areas (km²):")
print(fraser_valley)

# =============================================================================
# AAFC Annual Crop Inventory Analysis
# =============================================================================

# Load AAFC data
aafc_data <- read_csv(here("data", "aafc.csv"), show_col_types = FALSE) %>%
  rename(District = district) %>%
  dplyr::select(District, everything())

aafc_data[is.na(aafc_data)] <- 0

# Load Fraser Valley AAFC visualized image
fv_aafc_rast <- rast("data/FV_unVisualized_AAFC.tif")

# AAFC color scheme - all land cover types present in BC
aafc_classes <- tribble(
  ~Code, ~Color, ~Description,
  210, "#006600", "Coniferous",
  30, "#996666", "Exposed Land and Barren", 
  50, "#ffff00", "Shrubland",
  220, "#00cc00", "Broadleaf",
  80, "#993399", "Wetland",
  230, "#cc9900", "Mixedwood",
  110, "#cccc00", "Grassland",
  20, "#3333ff", "Water",
  34, "#cc6699", "Urban and Developed",
  122, "#ffcc33", "Pasture and Forages",
  120, "#cc6600", "Agriculture (undifferentiated)",
  153, "#d6ff70", "Canola and Rapeseed",
  133, "#dae31d", "Barley",
  146, "#92a55b", "Spring Wheat",
  162, "#8f6c3d", "Peas",
  147, "#ffff99", "Corn",
  188, "#ff6666", "Orchards",
  182, "#d20000", "Blueberry",
  131, "#ff9900", "Fallow",
  136, "#d1d52b", "Oats",
  190, "#7442bd", "Vineyards",
  183, "#cc0000", "Cranberry",
  167, "#82654a", "Beans",
  185, "#dc3200", "Other Berry",
  137, "#cacd32", "Rye",
  35, "#e1e1e1", "Greenhouses",
  145, "#809769", "Winter Wheat",
  177, "#ffcccc", "Potatoes",
  179, "#ffccff", "Other Vegetables",
  192, "#b5fb05", "Sod",
  194, "#07f98c", "Nursery",
  175, "#b74b15", "Vegetables",
  139, "#b9bc44", "Triticale",
  130, "#7899f6", "Too Wet to be Seeded",
  199, "#749a66", "Other Crops",
  189, "#c5453b", "Other Fruits",
  168, "#a39069", "Fababeans",
  197, "#8e7672", "Hemp",
  191, "#ffcc99", "Hops",
  174, "#b85900", "Lentils",
  160, "#896e43", "Pulses",
  155, "#d6cc00", "Mustard",
  154, "#8c8cff", "Flaxseed"
)

# Handle no-data values
fv_aafc_rast[fv_aafc_rast == 0] <- NA

# Plot Fraser Valley AAFC map
layout(matrix(c(1, 2), nrow = 1), widths = c(2, 1.5))

plot(fv_aafc_rast, 
     main = "Fraser Valley District - AAFC Annual Crop Inventory",
     col = aafc_classes$Color,
     legend = FALSE)

plot.new()
par(mar = c(1, 1, 1, 1))

legend(x = 0.05, y = 0.98, 
       legend = aafc_classes$Description,
       fill = aafc_classes$Color,
       border = "black",
       title = "AAFC Land Cover Classes (All Present in BC)",
       cex = 1.1,
       bty = "o",
       xjust = 0,
       yjust = 1,
       box.lwd = 1.5,
       box.col = "black")

# =============================================================================
# Fraser Valley AAFC Area Analysis
# =============================================================================

fraser_valley_aafc <- aafc_data %>%
  filter(District == "Fraser Valley") %>%
  dplyr::select(where(~ !all(. == 0))) %>%
  mutate(across(-District, ~ round(. / 1000000, 2)))

print("Fraser Valley AAFC Land Cover Areas (km²):")
print(fraser_valley_aafc)

# =============================================================================
# Cropland and Grassland Comparison
# =============================================================================

# Calculate total cropland from AAFC data
fraser_aafc <- aafc_data %>%
  filter(District == "Fraser Valley") %>%
  dplyr::select(-Peatland, -Wetland, -Shrubland, -`Urban and Developed`, 
                -`Exposed Land and Barren`, -`Mixedwood`, -`Broadleaf`, 
                -`Coniferous`, -`Forest (undifferentiated)`, -Water, -Sod, 
                -`Pasture and Forages`, -`Too Wet to be Seeded`)

fraser_valley_total_crop <- fraser_aafc %>%
  summarise(
    total_crop = sum(rowSums(
        dplyr::select(., where(is.numeric), -Grassland),
        na.rm = TRUE)))

print("Total cropland area comparison:")
print(paste("AAFC Total Crop Area:", round(fraser_valley_total_crop$total_crop / 1000000, 2), "km²"))

# Sanity check - compare total areas
sanity_ESA <- fraser_valley %>%
  summarise(
    total_area = sum(rowSums(
        dplyr::select(., where(is.numeric)),
        na.rm = TRUE)))

sanity_aafc <- fraser_valley_aafc %>%
  summarise(
    total_area = sum(rowSums(
        dplyr::select(., where(is.numeric)),
        na.rm = TRUE)))

print(paste("AAFC Total Area:", sanity_aafc$total_area, "km²"))
print(paste("ESA WorldCover Total Area:", sanity_ESA$total_area, "km²"))

# =============================================================================
# Dominant Crop Type Analysis by District
# =============================================================================

# Find dominant crop type for each district
dominant_crop <- aafc_data %>%
  dplyr::select(-Peatland, -Wetland, -Shrubland, -`Urban and Developed`, 
                -`Exposed Land and Barren`, -`Mixedwood`, -`Broadleaf`, 
                -`Coniferous`, -`Forest (undifferentiated)`, -Water, -Sod, 
                -`Pasture and Forages`, -`Too Wet to be Seeded`, -Cloud, 
                -Grassland, -`Agriculture (undifferentiated)`, -Fallow) 

dominant_crop$max_column <- colnames(dominant_crop)[apply(dominant_crop, 1, which.max)]

dominant_crop <- dominant_crop %>%
  dplyr::select(District, max_column)

# Load BC regional district boundaries
bc_admin2 <- regional_districts()

bc_admin2 <- bc_admin2 %>%
  mutate(District_clean = str_remove_all(ADMIN_AREA_NAME, 
                                         "Regional District of |Regional District| Region \\(Unincorporated\\)"),
         District_clean = str_trim(District_clean),
         District_clean = case_when(
           District_clean == "Columbia Shuswap" ~ "Columbia-Shuswap",
           District_clean == "Metro Vancouver" ~ "Greater Vancouver",
           District_clean == "qathet" ~ "Powell River",
           TRUE ~ District_clean
         )) %>%
  dplyr::filter(ADMIN_AREA_NAME != "North Coast Regional District")

bc_crops <- bc_admin2 %>%
  left_join(dominant_crop, by = c("District_clean" = "District"))

# Plot dominant crop types by district
ggplot() +
  geom_sf(data = bc_crops, aes(fill = max_column), color = "black", linewidth = 0.5) +
  scale_fill_brewer(palette = "Paired") +
  theme_minimal() +
  labs(fill = "Dominant Crop Type",
       title = "Dominant Crop Types by Regional District in British Columbia")

# =============================================================================
# Total Cropland Area by District
# =============================================================================

# Calculate total crop production by district
crop_totals <- aafc_data %>%
  dplyr::select(-Peatland, -Wetland, -Shrubland, -`Urban and Developed`, 
                -`Exposed Land and Barren`, -`Mixedwood`, -`Broadleaf`, 
                -`Coniferous`, -`Forest (undifferentiated)`, -Water, -Sod, 
                -`Pasture and Forages`, -`Too Wet to be Seeded`, -Cloud, 
                -Grassland, -`Agriculture (undifferentiated)`, -Fallow) %>%
  mutate(total_crop_area = rowSums(dplyr::select(., where(is.numeric)), na.rm = TRUE)) %>%
  dplyr::select(District, total_crop_area) %>%
  mutate(total_crop_area_km2 = total_crop_area / 1000000)

bc_crop_totals <- bc_admin2 %>%
  left_join(crop_totals, by = c("District_clean" = "District"))

# Plot total cropland area
ggplot() +
  geom_sf(data = bc_crop_totals, aes(fill = total_crop_area_km2), linewidth = 0.3) +
  scale_fill_gradient(low = "lightblue", high = "darkgreen", 
                      name = "Total Crop Area\n(km²)") +
  theme_minimal() +
  labs(title = "Total Cropland Area by District in British Columbia")

# =============================================================================
# Crop Diversity Analysis
# =============================================================================

# Analyze crop diversity by district
crop_diversity <- aafc_data %>%
  dplyr::select(-Peatland, -Wetland, -Shrubland, -`Urban and Developed`, 
                -`Exposed Land and Barren`, -`Mixedwood`, -`Broadleaf`, 
                -`Coniferous`, -`Forest (undifferentiated)`, -Water, -Sod, 
                -`Pasture and Forages`, -`Too Wet to be Seeded`, -Cloud, 
                -Grassland, -`Agriculture (undifferentiated)`, -Fallow) %>%
  mutate(
    crop_diversity = rowSums(dplyr::select(., where(is.numeric)) > 0, na.rm = TRUE),
    total_crop_area = rowSums(dplyr::select(., where(is.numeric)), na.rm = TRUE)
  ) %>%
  dplyr::select(District, crop_diversity, total_crop_area) %>%
  mutate(total_crop_area_km2 = total_crop_area / 1000000)

bc_crop_diversity <- bc_admin2 %>%
  left_join(crop_diversity, by = c("District_clean" = "District"))

# Plot crop diversity
ggplot() +
  geom_sf(data = bc_crop_diversity, aes(fill = crop_diversity), linewidth = 0.3) +
  scale_fill_gradient(low = "lightyellow", high = "darkred", 
                      name = "Number of\nCrop Types") +
  theme_minimal() +
  labs(title = "Crop Diversity by District in British Columbia")

# =============================================================================
# Identify Districts with Missing AAFC Data
# =============================================================================

missing_aafc <- aafc_data %>%
  filter(`Agriculture (undifferentiated)` == 0) %>%
  filter(Potatoes == 0) %>%
  filter(`Pasture and Forages` == 0)

print("Districts with minimal/missing AAFC agricultural data:")
print(missing_aafc$District)