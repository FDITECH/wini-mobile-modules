// import { faCheck, faChevronDown, faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import React, { ReactNode, createRef, forwardRef, useEffect, useRef, useState } from "react";
// import { FlatList, StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native";
// import { ColorSkin } from "../../assets/skin/colors";
// import { TypoSkin } from "../../assets/skin/typography";
// import { FBottomSheet, FTextField, hideBottomSheet, showBottomSheet } from "../export-component";
// import { closePopup, FPopup, showPopup } from "../popup/popup";
// import ScreenHeader from "../../screen/layout/header";

// interface Props {
//     value?: Array<string | number>,
//     placeholder?: string,
//     disabled?: boolean,
//     data: Array<{ id: string | number; name: string | ReactNode }>,
//     onChange: (itemList: Array<string | number>) => void,
//     helperText?: string,
//     helperTextColor?: string,
//     style?: TextStyle,
//     onSearch?: (value?: string) => Promise<Array<{ id: string | number; name: string | ReactNode }> | undefined>,
//     loadMore?: (value?: string) => Promise<Array<{ id: string | number; name: string | ReactNode }> | undefined>,
// }

// export default function MultiSelect(props: Props) {
//     const { value, placeholder, disabled, data, onChange, helperText, helperTextColor, style, onSearch, loadMore } = props
//     const botSheetRef = createRef<any>()
//     const ref = createRef<any>();
//     const [isShow, setShow] = useState(false)
//     const [showSelect, setShowSelect] = useState<Array<{ id: string | number, name: string | ReactNode }>>([])

//     useEffect(() => {
//         if (value && data) {
//             setShowSelect(data.filter(e => value.some(id => e.id === id)))
//         }
//     }, [value, data])

//     const toggleDropdown = () => {
//         setShow(true)
//         showPopup({
//             ref: botSheetRef,
//             // titleText: placeholder,
//             enableDismiss: true,
//             // dismiss: () => {
//             //     setShow(false)
//             // },
//             // prefixAction: <View />,
//             // suffixAction: <TouchableOpacity style={{ padding: 4 }} onPress={() => { setShow(false) }}><FontAwesomeIcon icon={faClose} size={18} color={ColorSkin.textColorGrey2} /></TouchableOpacity>,
//             children: <BttomSheetListOptions
//                 ref={botSheetRef}
//                 usingData={data}
//                 onSelect={(item) => {
//                     onChange(item)
//                     setShowSelect(data.filter(e => item.some(el => el === e.id)))
//                 }}
//                 selected={value}
//                 loadMore={loadMore}
//                 onSearch={onSearch}
//             />
//         })
//     }

//     return <TouchableOpacity ref={ref} style={[styles.container, { borderColor: isShow ? ColorSkin.inforColor : helperText?.length ? (helperTextColor ?? ColorSkin.errorColor) : '#00358014', backgroundColor: disabled ? '#0035801F' : style?.backgroundColor }]} onPress={disabled ? undefined : toggleDropdown}>
//         {/* <FBottomSheet ref={botSheetRef} /> */}
//         <FPopup ref={botSheetRef} />
//         {
//             value ? showSelect && typeof showSelect[0]?.name === 'string' ? <Text style={[TypoSkin.body3, { paddingVertical: showSelect.length >= 3 ? 4 : 0, flex: 1, fontSize: (style?.fontSize ?? TypoSkin.body3.fontSize), fontFamily: (style?.fontFamily ?? TypoSkin.body3.fontFamily), fontWeight: (style?.fontWeight ?? TypoSkin.body3.fontWeight), lineHeight: (style?.lineHeight ?? TypoSkin.body3.lineHeight), color: (style?.color ?? TypoSkin.body3.color), opacity: 0.4 }]}>
//                 {showSelect.slice(0, 3).map(e => e.name).join(', ')} {showSelect.length > 3 ? `, +${showSelect.length - 3}` : ''}
//             </Text> : <View style={{ gap: showSelect.length >= 2 ? 8 : 0, paddingVertical: 8, flex: 1 }}>
//                 {showSelect.slice(0, 2).map(e => e.name)}
//                 {showSelect.length > 2 ? <Text style={[TypoSkin.body3, { color: (style?.color ?? ColorSkin.subtitle), opacity: 0.6, paddingLeft: 4 }]}>+{showSelect.length - 2}</Text> : <View />}
//             </View>
//                 :
//                 <Text style={[TypoSkin.body3, { flex: 1, fontSize: (style?.fontSize ?? TypoSkin.body3.fontSize), fontFamily: (style?.fontFamily ?? TypoSkin.body3.fontFamily), fontWeight: (style?.fontWeight ?? TypoSkin.body3.fontWeight), lineHeight: (style?.lineHeight ?? TypoSkin.body3.lineHeight), color: (style?.color ?? TypoSkin.body3.color), opacity: 0.4 }]}>
//                     {placeholder ?? ''}
//                 </Text>
//         }
//         <FontAwesomeIcon icon={faChevronDown} size={14} color='#667994' />
//         {helperText?.length ?
//             <Text numberOfLines={1} style={[TypoSkin.subtitle3, { color: helperTextColor ?? ColorSkin.errorColor, position: 'absolute', bottom: 0, left: 2, transform: [{ translateY: 22 }] }]}>
//                 {helperText}
//             </Text> : null}
//     </TouchableOpacity>
// }

// const BttomSheetListOptions = forwardRef(function BttomSheetListOptions(data: {
//     onSearch?: (value?: string) => Promise<Array<{ id: string | number, name: string | ReactNode }> | undefined>,
//     loadMore?: (value?: string) => Promise<Array<{ id: string | number, name: string | ReactNode }> | undefined>,
//     usingData: Array<{ id: string | number, name: string | ReactNode }>,
//     selected?: Array<string | number>,
//     onSelect: (itemList: Array<string | number>) => void
// }, ref: any) {
//     // const BttomSheetListOptions = ({ onSearch, data = [], selected, onSelect, loadMore, ref }:
//     //     {
//     //         onSearch?: (value?: string) => Promise<Array<{ id: string | number, name: string | ReactNode }> | undefined>,
//     //         loadMore?: (value?: string) => Promise<Array<{ id: string | number, name: string | ReactNode }> | undefined>,
//     //         data: Array<{ id: string | number, name: string | ReactNode }>,
//     //         selected?: Array<string | number>,
//     //         onSelect: (itemList: Array<string | number>) => void, ref: any
//     //     }) => {
//     const { onSearch, usingData, selected, onSelect, loadMore } = data
//     const [searchOptions, setSearchOptions] = useState<Array<{ id: string | number; name: string | ReactNode }>>()
//     const searchRef = useRef<any>()

//     const [selectedList, setSelectedList] = useState<Array<string | number>>(selected ? selected : [])

//     return <View style={{ gap: 4, paddingBottom: 20, width: '100%', backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
//         <ScreenHeader title='Danh sách' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} prefix={<View />} />
//         {
//             onSearch ? <View style={{ paddingHorizontal: 16, width: '100%', paddingVertical: 8 }}>
//                 <FTextField
//                     ref={searchRef}
//                     style={{ ...TypoSkin.regular2, minHeight: 36, paddingVertical: 0, paddingHorizontal: 12, width: '100%' }}
//                     placeholder='Tìm kiếm'
//                     prefix={<FontAwesomeIcon icon={faSearch} size={12} color='#667994' />}
//                     onChange={async (vl) => {
//                         if (vl.trim().length) {
//                             if (onSearch) {
//                                 const res = await onSearch(vl)
//                                 setSearchOptions(res)
//                             } else {
//                                 setSearchOptions(usingData.filter(e => {
//                                     if (typeof e.name === 'string') {
//                                         return e.name.toLowerCase().includes(vl.trim().toLocaleLowerCase())
//                                     } else {
//                                         return (`${e.id}`).toLowerCase().includes(vl.trim().toLocaleLowerCase())
//                                     }
//                                 }))
//                             }
//                         } else {
//                             setSearchOptions(undefined)
//                         }
//                     }}
//                 />
//             </View> : undefined
//         }
//         <View style={{ height: 350, width: '100%' }}>
//             <FlatList
//                 style={onSearch ? { flex: 1, height: '100%', width: '100%' } : undefined}
//                 data={searchOptions ?? usingData}
//                 renderItem={({ item, index }) =>
//                     <TouchableOpacity
//                         style={[styles.item]}
//                         onPress={() => {
//                             if (selectedList?.some(e => e === item.id)) {
//                                 setSelectedList(selectedList.filter(e => e !== item.id) as any)
//                                 onSelect(selectedList.filter(e => e !== item.id) as any)
//                             } else {
//                                 setSelectedList([...selectedList, item.id] as any)
//                                 onSelect([...selectedList, item.id] as any)
//                             }

//                         }}>
//                         {typeof item.name === 'string' ?
//                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                 <Text style={TypoSkin.label1}>{item.name}</Text>
//                                 <View style={{ flex: 1 }} />
//                                 {selectedList && selectedList?.some(e => e === item.id) ? <FontAwesomeIcon icon={faCheck} size={16} color={ColorSkin.primary} /> : null}
//                             </View>
//                             :
//                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                 {item.name}
//                                 <View style={{ flex: 1 }} />
//                                 {selectedList && selectedList?.some(e => e === item.id) ? <FontAwesomeIcon icon={faCheck} size={16} color={ColorSkin.primary} /> : null}
//                             </View>}
//                     </TouchableOpacity>}
//                 keyExtractor={(item, index) => `${item.id}`}
//                 onEndReachedThreshold={0.1}
//                 onEndReached={({ distanceFromEnd }) => {
//                     if (distanceFromEnd > 0 && loadMore) {
//                         if (onSearch) {
//                             loadMore(searchRef.current.value).then(res => {
//                                 setSearchOptions(res)
//                             })
//                         }
//                     }
//                 }
//                 }
//                 ListEmptyComponent={() => <Text style={{ padding: 8 }}>Không tìm thấy kết quả phù hợp</Text>}
//             />
//         </View>
//     </View>
// })

// const styles = StyleSheet.create({
//     container: {
//         overflow: 'visible',
//         position: 'relative',
//         flexDirection: 'row',
//         minHeight: 40,
//         paddingHorizontal: 12,
//         borderWidth: 1,
//         borderStyle: 'solid',
//         alignItems: 'center',
//         borderRadius: 8,
//         columnGap: 12
//     },
//     item: {
//         alignItems: 'flex-start',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderBottomWidth: 0.5,
//         borderBottomColor: '#00358033'
//     },
// })
