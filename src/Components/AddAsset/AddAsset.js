import React from "react";
import * as PropTypes from "prop-types";
import {Button, Typography, withStyles} from "@material-ui/core"
import api from "../../api";
import AssetCategorySelect from "./AssetCategorySelect.js";
import CategoryFieldsList from "./CategoryFieldsList.js"

const styles = theme => ({
    root: {
        textAlign: "center"
    },
    header: {
        textAlign: 'center',
        padding: 40,
        width: "100%"
    },
    content: {
        display: "inline-block",
        width: 400,
        textAlign: 'center',
        padding: theme.spacing.unit * 3
    },
    addAssetButton: {
        marginTop: theme.spacing(3),
        width: "100%",
        height: 50,
    }
});

class AddAsset extends React.Component {
    state = {
        categories: [],
        categoryId: undefined,
        categoryName: undefined,
        assetName: '',
        categoryAttributes: [],
        categoryAttributesValues: {},
        attributesValues: {},
        isNotValidate: true,
        isAssetNameUnique: true,
    };

    static getUrlParams(location) {
        const searchParams = new URLSearchParams(location.search);
        return {
            categoryId: searchParams.get('category') || undefined,
        };
    }

    cleanStateWithoutCategories() {
        this.setState({
            categoryId: undefined,
            categoryName: undefined,
            assetName: '',
            categoryAttributes: [],
            categoryAttributesValues: {},
            attributesValues: {},
            isNotValidate: true,
            isAssetNameUnique: true,
        });
    }

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.setState({categories: response});
                document.body.style.cursor = 'default';
            });
    }

    fetchAssetNameAndValidate() {
        const name = this.state.assetName;
        if (name !== '') {
            api.fetch(
                api.endpoints.getAssetByName(name),
                (response) => {
                    if (response.length !== 0) {
                        this.setState({isAssetNameUnique: false});
                    } else {
                        this.setState({isAssetNameUnique: true});
                    }
                },
                (error) => {
                    console.log(error);
                });
        } else {
            this.setState({isAssetNameUnique: true});
        }
    }

    handleCategoryChange = (categoryId) => {
        if (categoryId !== this.state.categoryId) {
            if (categoryId === null) {
                this.props.history.push('/add-asset')
            } else {
                this.props.history.push(`/add-asset?category=${categoryId}`)
            }
        }
    };

    fetchAndSetValuesCategoryAttributes(selectedCategoryId) {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributesValues(selectedCategoryId),
            (response) => {
                this.setState({categoryAttributesValues: response});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetCategoryAttributes(selectedCategoryId) {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributes(selectedCategoryId),
            (response) => {
                this.setState({categoryAttributes: response});
                document.body.style.cursor = 'default';
            });
        this.fetchAndSetValuesCategoryAttributes(selectedCategoryId);
    }

    addNewAttribute = (name, type, value) => {
        const attribute = {
            name: name,
            type: type
        };
        const attrib = {
            attribute: attribute,
            value: value
        };
        return attrib
    };

    handleAddAssetButton = () => {

        const attributes = [];
        this.state.categoryAttributes.forEach((attribute) => {
            attributes.push(this.addNewAttribute(attribute.name, attribute.type, this.state.attributesValues[attribute.name]))
        });
        const asset = {
            attributes: attributes,
            categoryId: this.state.categoryId,
            name: this.state.assetName,
        };
        console.log(JSON.stringify(asset));
        api.fetch(
            api.endpoints.addAsset(asset), () => {
                this.cleanStateWithoutCategories();
                this.forceUpdate();
            }
        );
    };

    getActiveCategory() {
        return this.state.categories.find(c => c.id === this.state.categoryId) || null
    }

    validateAssertName = () => {
        this.fetchAssetNameAndValidate();
    };

    handleAssetNameChange = (event) => {
        this.setState({assetName: event.target.value.trim()});
    };

    handleAttributeValuesChangeCallback = (event) => {
        let temp = this.state.attributesValues;
        temp[event.target.name.trim()] = event.target.value.trim();
        this.setState({attributesValues: temp});
    };

    handleValidateCallback = (event) => {
        let isValid = true;
        document.getElementById('textFieldsForm').childNodes.forEach((textfield) => {
            textfield.childNodes.forEach((child) => {
                if (child instanceof HTMLDivElement) {
                    if (child.getElementsByTagName("input")[0].value === "") {
                        isValid = false;
                    }
                }
            });
        });
        this.setState({isNotValidate: !isValid});
    };

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {categoryId} = AddAsset.getUrlParams(window.location);
        if (prevState.categoryId !== categoryId) {
            this.setState({categoryId: categoryId});
            if (categoryId !== undefined) {
                this.fetchAndSetCategoryAttributes(categoryId);
            }
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography variant="h3">
                        Add new asset
                    </Typography>
                </div>
                <div className={classes.content}>
                    <Typography variant="h6" component="h2">
                        Category
                    </Typography>
                    <AssetCategorySelect
                        categories={this.state.categories.map(c => ({
                            id: c.id,
                            name: c.name,
                        }))}
                        categoryChangeCallback={this.handleCategoryChange}
                        selectedCategoryId={this.state.categoryId}
                    />
                    {this.getActiveCategory() &&
                    <CategoryFieldsList
                        category={this.getActiveCategory()}
                        categoryAttributes={this.state.categoryAttributes}
                        categoryAttributesValues={this.state.categoryAttributesValues}
                        assetNameChangeCallback={this.handleAssetNameChange}
                        validateAssertNameCallback={this.validateAssertName}
                        attributeValuesChangeCallback={this.handleAttributeValuesChangeCallback}
                        validateCallback={this.handleValidateCallback}
                        isAssetNameUnique={this.state.isAssetNameUnique}
                    />
                    }
                    < Button
                        className={classes.addAssetButton}
                        onClick={this.handleAddAssetButton}
                        color="primary"
                        variant="contained"
                        disabled={this.state.isNotValidate || !this.state.isAssetNameUnique}
                    >
                        add asset
                    </Button>
                </div>
            </div>
        );
    }
}

AddAsset.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAsset)