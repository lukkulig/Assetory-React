import React from "react";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory';

const styles = theme => ({
    root: {},
    content: {
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
                    <Tabs defaultActiveKey="editCategory" id="categoryActions">
                        <Tab eventKey="addCategory" title="Add Category">
                            <AddCategory/>
                        </Tab>
                        <Tab eventKey="editCategory" title="Edit Category">
                            <EditCategory/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

ManageCategories.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageCategories)