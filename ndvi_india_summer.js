var gaul = ee.FeatureCollection("FAO/GAUL/2015/level0");
// Filter the dataset to India
var india = gaul.filter(ee.Filter.eq('ADM0_NAME', 'India'));
// Extract the boundary of India
var indiaBoundary = india.geometry();
// print(indiaBoundary)
// Display the boundary of India in Google Earth Engine
// Map.addLayer(indiaBoundary);

// Load the MODIS MOD09GA dataset
// filtering the dataset to the summer season for India
var modis = ee.ImageCollection("MODIS/061/MOD09GA")

// Get the least cloudy image in 2015.
var image = ee.Image(
  modis.filterBounds(indiaBoundary)
    .filterDate('2022-04-01', '2022-06-30')
    .sort('CLOUD_COVER')
    .first()
);
// Compute the Normalized Difference Vegetation Index (NDVI).
var nir = image.select('sur_refl_b02');
var red = image.select('sur_refl_b01');
var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');
// Clip the NDVI image to the India boundary 
var ndviIndia = ndvi.clip(indiaBoundary);
// Display the result.
Map.centerObject(indiaBoundary, 8);
var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
// Display the clipped NDVI 
Map.addLayer(ndviIndia, ndviParams, 'NDVI India');
