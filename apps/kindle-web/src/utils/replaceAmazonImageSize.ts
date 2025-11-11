const NEW_DASHBOARD_IMAGE_SIZE = 'SY250';

export const replaceAmazonImageSize = (url: string, newSize = NEW_DASHBOARD_IMAGE_SIZE) => {
  if (/_S[XYL]/.test(url)) {
    return url.replace(/_(S[XYL][0-9,]+)[^/]*\.(jpg|png|webp|jpeg)$/i, `_${newSize}.$2`);
  }
  return url.replace(/\.(jpg|png|webp|jpeg)$/i, `_${newSize}.$1`);
};
