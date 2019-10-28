import React from "react";
import * as PropTypes from "prop-types";
import {Button, Typography, withStyles} from "@material-ui/core"
import api from "../api";
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
        localisation: '',
        license: '',
        owner: '',
        user: '',
        assetValue: '',
        backup: '',
        categoryAttributes: [],
        attributesValues: {},
        isNotValidate: true
    };

    static getUrlParams(location) {
        const searchParams = new URLSearchParams(location.search);
        return {
            categoryId: searchParams.get('category') || undefined,
        };
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

    handleCategoryChange = (categoryId) => {
        if (categoryId !== this.state.categoryId) {
            if (categoryId === null) {
                this.props.history.push('/add-asset')
            } else {
                this.props.history.push(`/add-asset?category=${categoryId}`)
            }
        }
    };

    fetchAndSetCategoryAttributes(selectedCategoryId) {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributes(selectedCategoryId),
            (response) => {
                this.setState({categoryAttributes: response});
                document.body.style.cursor = 'default';
            });
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
    }

    handleAddAssetButton = () => {

        const attributes = [];
        attributes.push(this.addNewAttribute("Location", "text", this.state.localisation));
        attributes.push(this.addNewAttribute("License", "text", this.state.license));
        attributes.push(this.addNewAttribute("Value", "number", this.state.assetValue));
        attributes.push(this.addNewAttribute("Owner", "text", this.state.owner));
        attributes.push(this.addNewAttribute("User", "text", this.state.user));
        this.state.categoryAttributes.forEach((attribute) => {
            attributes.push(this.addNewAttribute(attribute.name, attribute.type, this.state.attributesValues[attribute.name]))
        });
        const asset = {
            attributes: attributes,
            categoryId: this.state.categoryId,
            name: this.state.assetName,
        };
        console.log(JSON.stringify(asset))
        api.fetch(
            api.endpoints.addAsset(asset), () => {
                this.setState({
                    assetName: '',
                    localisation: '',
                    license: '',
                    owner: '',
                    user: '',
                    assetValue: '',
                    backup: '',
                    categoryAttributes: [],
                    attributesValues: {},
                    isNotValidate: true
                })
            }
        );
    };

    getActiveCategory() {
        return this.state.categories.find(c => c.id === this.state.categoryId) || null
    }

    handleAssetNameChange = (event) => {
        this.setState({assetName: event.target.value.trim()});
    };

    handleLocalisationChange = (event) => {
        this.setState({localisation: event.target.value.trim()});
    };

    handleLicenseChangeCallback = (event) => {
        this.setState({license: event.target.value.trim()});
    };

    handleOwnerChangeCallback = (event) => {
        this.setState({owner: event.target.value.trim()});
    };

    handleUserChangeCallback = (event) => {
        this.setState({user: event.target.value.trim()});
    };

    handleAssetValueChangeCallback = (event) => {
        this.setState({assetValue: event.target.value.trim()});
    };

    handleBackupChangeCallback = (event) => {
        this.setState({backup: event.target.value.trim()});
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
                        assetNameChangeCallback={this.handleAssetNameChange}
                        localisationChangeCallback={this.handleLocalisationChange}
                        licenseChangeCallback={this.handleLicenseChangeCallback}
                        ownerChangeCallback={this.handleOwnerChangeCallback}
                        userChangeCallback={this.handleUserChangeCallback}
                        assetValueChangeCallback={this.handleAssetValueChangeCallback}
                        backupChangeCallback={this.handleBackupChangeCallback}
                        attributeValuesChangeCallback={this.handleAttributeValuesChangeCallback}
                        validateCallback={this.handleValidateCallback}
                    />
                    }
                    < Button
                        className={classes.addAssetButton}
                        onClick={this.handleAddAssetButton}
                        color="primary"
                        variant="contained"
                        disabled={this.state.isNotValidate}
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