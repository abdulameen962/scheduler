import React from "react"
import PropTypes from "prop-types"
import * as Updates from 'expo-updates';

class Alerter extends React.Component {
    // componentDidMount(){
    //     this.onFetchUpdateAsync()
    // }
    // onFetchUpdateAsync = async () => {
    //     try {
    //       const update = await Updates.checkForUpdateAsync();
    
    //       if (update.isAvailable) {
    //         await Updates.fetchUpdateAsync();
    //         await Updates.reloadAsync();
    //       }
    //     } catch (error) {
    //       // You can also add an alert() to see the error message in case of an error when fetching updates.
    //       alert(`Error fetching latest Expo update: ${error}`);
    //     }
    // }

    render(){
        const {children} = this.props;
        return (
            <>
                {children}
            </>
        )
    }
}

Alerter.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Alerter;