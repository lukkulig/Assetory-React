import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles/index';
import Typography from '@material-ui/core/Typography/index';
import styles from "./Overview.styles";
import api from "../api";

class Overview extends React.Component {

    state = {
        greetings: "",
    };

    fetchAndSetGreetings() {
        document.body.style.cursor = 'wait';
        api.fetchString(
            api.endpoints.getGreeting(),
            (response) => {
                this.setState({greetings: response});
            });
    }

    componentDidMount() {
        this.fetchAndSetGreetings();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Typography variant="h4" gutterBottom>
                        <p>Overview</p>
                        <p>{this.state.greetings}</p>
                    </Typography>
                </div>
            </div>
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview)