import React from "react";
import * as PropTypes from "prop-types";
import {Button, MenuItem, Select, TextField, withStyles} from "@material-ui/core";
import api from "../../api";
import {BeatLoader} from "react-spinners";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CreatableSelect from "react-select/lib/Creatable";
import SnackBarContent from "@material-ui/core/SnackBarContent"
import SnackBar from "@material-ui/core/SnackBar"
import IconButton from "@material-ui/core/IconButton"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const styles = ({
    root: {},
    content: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    textField: {
        width: 400,
    },
    select: {
        textAlign: 'left',
        paddingLeft: 10,
        width: 400,
    }
});

class AddAssetNew extends React.Component {
    state = {
        categories: null,
        selectedCategory: null,
        selectedCategoryAttributes: null,
        categoryAttributesValues: {},
        attributesValues: {},
        assetName: '',
        assetNameError: false,
        assetNameEmpty: true,
        attributesError: true,
        snackOpen: false,
        snackMsg: '',
        options: []
    };

    isLoading() {
        return this.state.categories === null
            || this.state.selectedCategory === null
            || this.state.selectedCategoryAttributes == null;
    }

    componentDidMount() {
        this.fetchAndSetCategories()
            .then(() => this.fetchAndSetSelectedCategoryAttributes());
    }

    componentWillUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({
                categories: null,
                selectedCategory: null,
                selectedCategoryAttributes: null
            });
            this.fetchAndSetCategories()
                .then(() => this.fetchAndSetSelectedCategoryAttributes());
        }
    }

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        return api.fetch(
            api.endpoints.getCategoryTrees(),
            (response) => {
                let result = response.map(c => {
                    return {
                        category: c.category,
                        subCategories: c.subCategories
                    }
                });
                let categories = this.prepareCategories(result, 15);
                this.setState({categories: categories});
                this.setState({selectedCategory: categories[0]});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetSelectedCategoryAttributes() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributes(this.state.selectedCategory.id),
            (response) => {
                this.setState({selectedCategoryAttributes: response});
                let attributes = {};
                response.forEach((attribute) => {
                    attributes[attribute.name] = "";
                });
                this.setState({attributesValues: attributes});
                document.body.style.cursor = 'default';
            }
        );
        this.fetchAndSetValuesCategoryAttributes(this.state.selectedCategory.id);
    }

    fetchAndSetValuesCategoryAttributes(selectedCategoryId) {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributesValues(selectedCategoryId, true),
            (response) => {
                this.setState({categoryAttributesValues: response});
                document.body.style.cursor = 'default';
                this.prepareOptions(response);
            });
    }

    prepareCategories(categories, paddingLeft) {
        let result = [];
        categories.forEach((category) => {
            result.push({
                id: category.category.id,
                name: category.category.name,
                subcategoryIds: category.category.subcategoryIds,
                parentCategoryId: category.category.parentCategoryId,
                additionalAttributes: category.category.additionalAttributes,
                paddingLeft: paddingLeft
            });
            let subCategoriesIds = this.prepareCategories(category.subCategories, (paddingLeft + 20));
            result = result.concat(subCategoriesIds);
        });
        return result;
    }

    findCategory = (categoryId) => {
        let foundCategory = this.state.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleSelectedCategoryChange = (event) => {
        this.setState({
            selectedCategory: this.findCategory(event.target.value),
        }, () => {
            if (this.state.selectedCategory !== null) {
                api.fetch(
                    api.endpoints.getCategoryAttributes(this.state.selectedCategory.id),
                    (response) => {
                        this.setState({selectedCategoryAttributes: response});
                        let attributes = {};
                        response.forEach((attribute) => {
                            attributes[attribute.name] = undefined;
                        });
                        this.setState({attributesValues: attributes});
                    }
                );
                this.fetchAndSetValuesCategoryAttributes(this.state.selectedCategory.id);
            }
        });
    };

    handleAssetNameChange = (event) => {
        if (this.state.categoryAttributesValues.name.includes(event.target.value) && this.state.assetNameError === false) {
            this.setState({assetNameError: true})
        } else if (!this.state.categoryAttributesValues.name.includes(event.target.value) && this.state.assetNameError === true) {
            this.setState({assetNameError: false})
        }
        this.setState({assetNameEmpty: event.target.value === ""});
        this.setState({assetName: event.target.value});
        this.isValid();
    };

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    };

    addNewAttribute = (name, type, required, value) => {
        const attribute = {
            name: name,
            type: type,
            required: required
        };
        return {
            attribute: attribute,
            value: value
        }
    };

    handleAddAssetButton = () => {
        const attributes = [];
        this.state.selectedCategoryAttributes.forEach((attribute) => {
            attributes.push(this.addNewAttribute(
                attribute.name,
                attribute.type,
                attribute.required,
                (this.state.attributesValues[attribute.name] === "" || this.state.attributesValues[attribute.name] === undefined) ? "" : this.state.attributesValues[attribute.name]))
        });
        const relatedAssetsIds = [];
        const asset = {
            attributes: attributes,
            categoryId: this.state.selectedCategory.id,
            name: this.state.assetName,
            relatedAssetsIds: relatedAssetsIds,
        };
        api.fetch(api.endpoints.addAsset(asset),
            (response) => {
                this.setState({
                    categories: null,
                    selectedCategory: null,
                    selectedCategoryAttributes: null,
                    categoryAttributesValues: {},
                    assetName: '',
                    assetNameError: false,
                    assetNameEmpty: true,
                    attributesError: true,
                });
                this.handleSnackbarOpen(response.name);
                this.sleep(1000).then(() => {
                    this.fetchAndSetCategories()
                        .then(() => this.fetchAndSetSelectedCategoryAttributes());
                })
            });
    };

    prepareOptions = (attributes) => {
        let options = {};
        Object.keys(attributes).forEach(key => {
            if (attributes.hasOwnProperty(key)) {
                for (let key in attributes) {
                    let names = [];
                    attributes[key].forEach(attribute => {
                        let option = {
                            label: '',
                            value: ''
                        };
                        option.label = attribute;
                        option.value = attribute;
                        names.push(option);
                    });
                    options[key] = names;
                }
            }
        });
        this.setState({options: options});
        this.isValid();
    };

    handleAttributeValuesChangeTextCallback = (newValue, action, name) => {
        let temp = this.state.attributesValues;
        if (newValue !== null) {
            temp[name] = newValue.value.trim();
        } else if (action.action === 'clear') {
            temp[name] = ''
        }
        this.setState({attributesValues: temp});
        this.isValid();
    };

    handleAttributeValuesChangeCallback = (event) => {
        let temp = this.state.attributesValues;
        temp[event.target.name.trim()] = event.target.value.trim();
        this.setState({attributesValues: temp});
        this.isValid();
    };

    handleSnackbarClose = () => {
        this.setState({snackOpen: false});
    };

    handleSnackbarOpen = (name) => {
        this.setState({snackOpen: true});
        this.setState({snackMsg: "Asset " + name + " was created!"})
    };

    isValid() {
        let validation = true;
        Object.keys(this.state.attributesValues).forEach(key => {
            if (this.state.attributesValues.hasOwnProperty(key)) {
                if (this.state.selectedCategoryAttributes.find(attribute => attribute.name === key).required
                    && (this.state.attributesValues[key] === undefined || this.state.attributesValues[key] === "")) {
                    validation = false;
                }
            }
        });
        this.setState({attributesError: !validation})
    };

    render() {
        const {classes} = this.props;
        const attributesList = [];
        let i = 0;
        if (this.state.selectedCategoryAttributes !== null) {
            this.state.selectedCategoryAttributes.forEach((attribute) => {
                if (attribute.type === "text") {
                    attributesList.push(
                        <div className={classes.content} key={i}>
                            <CreatableSelect
                                id={attribute.name}
                                name={attribute.name}
                                className={classes.select}
                                isClearable
                                placeholder={"Select " + attribute.name}
                                onChange={(newValue, action) => this.handleAttributeValuesChangeTextCallback(newValue, action, attribute.name)}
                                options={this.state.options[attribute.name]}
                            />
                        </div>
                    );
                } else {
                    attributesList.push(
                        <div className={classes.content} key={i}>
                            <TextField
                                id={attribute.name}
                                name={attribute.name}
                                type={attribute.type}
                                label={attribute.name}
                                className={classes.select}
                                onChange={this.handleAttributeValuesChangeCallback}
                                required={attribute.required}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    );
                }
                i++;
            });
        }
        return (
            <div className={classes.root}>
                <SnackBar open={this.state.snackOpen}
                          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                          autoHideDuration={300000} onClose={this.handleSnackbarClose}>
                    <SnackBarContent
                        style={{backgroundColor: 'green'}}
                        message={
                            <span id="message-id">
                            <CheckCircleIcon style={{padding:4}}/>
                                {this.state.snackMsg}
                                    </span>
                        }
                        action={[<IconButton key="close" aria-label="Close" color="inherit"
                                             onClick={this.handleSnackbarClose}>
                            x
                        </IconButton>]}/>
                </SnackBar>
                {!this.isLoading() ? (
                    <form className={classes.content} noValidate>
                        <div className={classes.content}>
                            <FormControl>
                                <InputLabel id="selected-category-select-label">Category</InputLabel>
                                <Select className={classes.select}
                                        id="selected-category-select"
                                        labelId="selected-category-select-label"
                                        value={this.state.selectedCategory.id}
                                        onChange={this.handleSelectedCategoryChange}
                                >
                                    {this.state.categories.map(category =>
                                        <MenuItem style={{paddingLeft: category.paddingLeft}}
                                                  key={category.id}
                                                  value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={classes.content}>
                            <TextField
                                error={this.state.assetNameError || this.state.assetNameEmpty}
                                required={true}
                                className={classes.textField}
                                label={"Asset name"}
                                value={this.state.assetName}
                                onChange={this.handleAssetNameChange}
                                helperText={this.state.assetNameError === true ? 'Asset with that name already exists' : this.state.assetNameEmpty === true ? 'Asset name is required' : ''}
                            />
                        </div>
                        {attributesList}
                        <div className={classes.content}>
                            <Button variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleAddAssetButton}
                                    disabled={this.state.assetNameError || this.state.attributesError || this.state.assetNameEmpty}
                            >
                                Add Asset
                            </Button>
                        </div>
                    </form>
                ) : (
                    <BeatLoader
                        size={10}
                        color={"#3f51b5"}
                    />
                )}
            </div>
        );
    }
}

AddAssetNew.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAssetNew)