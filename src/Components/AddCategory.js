import React from "react";
import * as PropTypes from "prop-types";
import {withStyles, TextField, Button, Select} from "@material-ui/core";
import CategoryAttributes from "./CategoryAttributes"
import api from "../api";

const styles = ({
    root: {},
    content: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
});

class AddCategory extends React.Component {
    state = {
        categories: [],
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        supercategoryId: undefined,
        categoryName: ''
    };

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.setState({categories: response.content});
                document.body.style.cursor = 'default';
            });
    }

    findCategory = (categoryId) => {
        const foundCategory = this.state.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleSupercategoryChange = (categoryId) => this.setState({supercategoryId: categoryId});

    handleSaveAttributeButton = () => {
        const attribute = {
            name: this.state.newAttributeName,
            type: this.state.newAttributeType
        };
        this.state.attributes.concat(attribute)
    };

    handleAddCategoryButton = () => {
        const category = {
            additionalAttributes: this.state.attributes,
            name: this.state.categoryName,
            parentCategoryId: this.state.supercategoryId
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.content} noValidate>
                    <h4>Supercategory</h4>
                    <Select
                        classes={classes}
                        value={this.findCategory(this.state.supercategoryId)}
                        onChange={this.handleSupercategoryChange}
                        options={this.state.categories.map(category => category.name)}
                    />
                    <h4>Category name</h4>
                    <TextField
                        className={classes.textField}
                        label={"Category name"}
                        value={this.state.categoryName}
                        variant="outlined"
                        // component={}
                    /><br/>
                    <TextField
                        className={classes.textField}
                        label={"Additional attribute"}
                        value={this.state.newAttributeName}
                        variant="outlined"
                        helperText="Attribute required for all assets in this category"
                    />
                    <Select
                        classes={classes}
                        value={this.state.newAttributeType}
                        // onChange={this.handleChange}
                    >
                        <option value={"text"}>Text</option>
                        <option value={"number"}>Number</option>
                        <option value={"date"}>Date</option>
                    </Select>
                    <Button variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleSaveAttributeButton}
                    >
                        Save attribute
                    </Button><br/>
                    <CategoryAttributes
                        classes={classes}
                        attributes={this.state.attributes}
                    /><br/>
                    <Button variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleAddCategoryButton}
                    >
                        Add category
                    </Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(AddCategory)