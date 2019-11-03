import React from "react";
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
        padding: theme.spacing(3),
    }
});

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class ManageCategories extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event) => {
        this.setState({value: event});
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Tabs value={this.state.value} onSelect={this.handleChange} defaultActiveKey="addCategory" id="categoryActions" >
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