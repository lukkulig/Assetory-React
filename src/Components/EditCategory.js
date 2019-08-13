import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {},
    content: {
        textAlign: 'center',
        padding: theme.spacing.unit * 3,
    }
});

class EditCategory extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <h1>Edit category</h1>
        );
    }
}

export default withStyles(styles)(EditCategory)