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
    View
  } from '@gluestack-ui/themed';

import PropTypes from "prop-types"

const CustomSelect = ({onChange,label="Choose option",values=[],onOpen}) => {

    return (
        <View mb="$2">
            <Label text="Goal" />
            <Select width="$full" mt="$1" selectedLabel={label} onValueChange={onChange} onOpen={() => onOpen()}>
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
                    {
                        values && values.length > 0 ? values.map((goal,index) => {
                            const {title,id,click} = goal;
                            if (click) {
                                return (
                                    <SelectItem key={index} label={title} value={id} onPress={() => {
                                        click();
                                    }} />
                                )
                            }

                            return (
                                <SelectItem key={index} label={title} value={id} />
                            )

                        }):
                        (
                            <SelectItem label="Loading..." value="loading..." isDisabled={true} />
                        )
                    }
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