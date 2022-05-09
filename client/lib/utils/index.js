export const getItemFromEnumListByValue = (value, enumList) => {
  return enumList.find(item => item.value === value)
}