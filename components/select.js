import React,{FC} from "react"
import Label from '../components/label';
import { 
    Text,
    Heading,
    Pressable ,
    Select,
    SelectPortal,
    SelectInput,
    SelectIcon,
    Icon,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
    SelectTrigger,
    ChevronDownIcon,
    View,
    // ScrollView
  } from '@gluestack-ui/themed';

import { Image,ScrollView } from "react-native";
import appStyles from "../styles/appStyles";
import PropTypes from "prop-types"

const CustomSelect = ({onChange,label="Choose option",values=[],onOpen}) => {

    return (
        <View mb="$2">
                <Label text={label} />
                <Select width="$full" mt="$1" selectedLabel={label} onValueChange={onChange} onOpen={() => {
                    if (onOpen) onOpen()
                }}>
                    <SelectTrigger variant="underlined" size="md" paddingHorizontal="$1">
                        <SelectInput placeholder="Select option" color="$secondary500"/>
                        <SelectIcon mr="$3">
                        <Icon as={ChevronDownIcon} color="$secondary500" />
                        </SelectIcon>
                    </SelectTrigger>
                        <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            <ScrollView style={{maxHeight:300,overflow:"hidden",width:"100%"}} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                                {
                                    values && values.length > 0 ? values.map((goal,index) => {
                                        const {title,id,click,image,name,color} = goal;
                                        if (click) {
                                            return (
                                                <SelectItem key={index} label={title} value={id} onPress={() => {
                                                    click();
                                                }} />
                                            )
                                        }

                                        return (
                                            <View key={index} width={"100%"} paddingVertical="$1">
                                                <SelectItem label={title?title:name} value={id} />
                                                {
                                                    image && (
                                                        <Image
                                                            source={image}
                                                            alt={title}
                                                            style={[appStyles.tinyImg,{position:"absolute",right:10,top:"10%",width:35,height:35}]}
                                                            resizeMode="contain"
                                                        />
                                                    )
                                                }
                                                {
                                                    color && (
                                                        <View style={{
                                                            width:20,
                                                            height:20,
                                                            backgroundColor:color,
                                                            borderRadius: 10,
                                                            position:"absolute",
                                                            right:10,
                                                            top:15
                                                        }}>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        )

                                    }):
                                    (
                                        <SelectItem label="Loading..." value="loading..." isDisabled={true} />
                                    )
                                }
                            </ScrollView>
                            </SelectContent>
                        </SelectPortal>
                </Select>
        </View>
    )
}

CustomSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
}

export default CustomSelect;