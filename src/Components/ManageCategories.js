import React from "react";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {},
    content: {
        float: 'center',
        textAlign: 'center',
        padding: theme.spacing.unit * 3,
    }
});

class ManageCategories extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Typography variant="h4" gutterBottom>
                        ManageCategories
                    </Typography>
                </div>
            </div>
        );
    }
}

ManageCategories.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageCategories)