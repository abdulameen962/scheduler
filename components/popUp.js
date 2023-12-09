import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";
import { Modal,
    ModalBackdrop,
    ModalHeader,
    Heading,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Icon,
    Text,
    ModalContent, 
    Center,
    CloseIcon,
    ButtonText,
    Pressable
} from '@gluestack-ui/themed';

const PopUp = props => {
    const {header,text,onSubmit,triggerElement,positive} = props;
    const [showModal, setShowModal] = useState(false);
    const [action,setAction] = useState(false);
    const ref = React.useRef(null);

    useEffect(() => {
        if (action) onSubmit();
    },[action])

    return (
    <Center h={300}>
      <Button onPress={() => setShowModal(true)} ref={ref}>
        {triggerElement}
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        finalFocusRef={ref}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">{header}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>
              {text}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                setShowModal(false)
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              action={positive==true?"positive":"negative"}
              borderWidth="$0"
              onPress={() => {
                setAction(true)
              }}
            >
              <ButtonText>{props.action}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
    )
}

PopUp.propTypes = {
    header: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    triggerElement: PropTypes.element.isRequired,
    positive: PropTypes.bool.isRequired || true
}

export default PopUp;