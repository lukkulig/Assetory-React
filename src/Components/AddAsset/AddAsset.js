import React from "react";
import * as PropTypes from "prop-types";
import {Button, MenuItem, Select, TextField, withStyles} from "@material-ui/core";
import api from "../../api";
import {BeatLoader} from "react-spinners";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CreatableSelect from "react-select/lib/Creatable";
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import SuccessSnackBar from "../SuccessSnackBar";

const styles = ({
    root: {
        height: '100v',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        marginTop: 25,
        marginBottom: 25,
        marginLeft: 10,
        marginRight: 10,
    },
    textField: {
        textAlign: 'left',
        width: 580,
    },
    card: {
        width: 600
    },
    select: {
        textAlign: 'left',
        paddingLeft: 10,
        width: 580,
    },
    selectAssets: {
        textAlign: 'left',
        paddingLeft: 10,
        width: 270,
    },
    selectCategory: {
        textAlign: 'left',
        paddingRight: 10,
        paddingBottom: 10,
        width: 250,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
        minWidth: 200
    },
    contentWithButton: {
        maxWidth: 400,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    addAssetButton: {
        margin: 2,
        width: 580,
    },
    addRelatedAssetButton: {
        margin: 2,
        paddingBottom: 10,
        width: 250,
    },
    formControl: {
        paddingLeft: 20
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    noContent: {
        width: "100%",
        textAlign: "center",
        paddingTop: 10
    }
});

class AddAsset extends React.Component {
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
        selectedCategoryRelated: {
            id: '',
            name: '',
        },
        selectedCategoryRelatedAssets: [],
        isSelected: false,
        selectedAssets: [],
        relatedAssets: [],
        options: [],
        expanded: false
    };

    isLoading() {
        return this.state.categories === null
            || this.state.selectedCategory === null
    }

    componentDidMount() {
        this.fetchAndSetCategories()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({
                categories: null,
                selectedCategory: null,
                selectedCategoryAttributes: null
            });
            this.fetchAndSetCategories()
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
                this.setState({
                    selectedCategory: {
                        id: '',
                        name: '',
                    },
                });
                document.body.style.cursor = 'default';
            });
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
            if (this.state.selectedCategory !== null && this.state.selectedCategory.id !== '') {
                this.setState({selectedCategoryAttributes: null});
                api.fetch(
                    api.endpoints.getCategoryAttributes(this.state.selectedCategory.id),
                    (response) => {
                        this.setState({selectedCategoryAttributes: response});
                        let attributes = {};
                        response.forEach((attribute) => {
                            attributes[attribute.name] = undefined;
                        });
                        this.setState({attributesValues: attributes, assetName: '', assetNameEmpty: true});
                    }
                );
                this.fetchAndSetValuesCategoryAttributes(this.state.selectedCategory.id);
            }
        });
    };

    handleSelectedCategoryRelatedAssetChange = (event) => {
        this.setState({
            selectedCategoryRelated: this.findCategory(event.target.value),
        }, () => {
            if (this.state.selectedCategoryRelated !== null) {
                api.fetch(
                    api.endpoints.getAssetsByCategory(this.state.selectedCategoryRelated.id),
                    (response) => {
                        let result = response.filter((el) =>
                            !(this.state.relatedAssets || []).map(related => related.id).includes(el.id));
                        this.setState({selectedCategoryRelatedAssets: result});
                    }
                );
                (this.setState({isSelected: true}));
            } else {
                this.setState({isSelected: false})
            }
            this.setState({selectedAssets: []})
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
        this.state.relatedAssets.forEach(asset => relatedAssetsIds.push(asset.id));
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
                    relatedAssets: [],
                    isSelected: false,
                    expanded: false
                });
                this.handleSnackbarOpen(response.name);
                this.sleep(1000).then(() => {
                    this.fetchAndSetCategories()
                })
            });
    };

    prepareOptions = (attributes) => {
        let options = {};
        Object.keys(attributes).forEach(key => {
            if (attributes.hasOwnProperty(key)) {
                for (let key in attributes) {
                    let names = [];
                    attributes[key].filter(attribute => attribute !== '').forEach(attribute => {
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
        this.setState({snackOpen: true, snackMsg: "Asset " + name + " successfully created!"})
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

    handleSelectedAssetsChange = selectedAssets => {
        this.setState({
            selectedAssets: selectedAssets.target.value,
        });
    };

    handleDeleteChip = chipName => {
        let chips = this.state.selectedAssets;
        this.setState({selectedAssets: chips.filter(chip => chip.name !== chipName)});
    };

    handleDeleteRelatedAssets = chipName => {
        let chips = this.state.relatedAssets;
        this.setState({relatedAssets: chips.filter(chip => chip.name !== chipName)});
    };

    handleSaveAttributes = () => {
        let related = this.state.relatedAssets;
        let selected = [];
        this.state.selectedAssets.forEach(asset => {
                let duplicated = false;
                this.state.relatedAssets.forEach(selected => {
                    if (JSON.stringify(selected) === JSON.stringify(asset))
                        duplicated = true;
                });
                if (!duplicated)
                    selected.push(asset);
            }
        );
        related = [...new Set(related.concat(selected))];
        this.setState({
            relatedAssets: related,
            selectedCategoryRelated: {
                id: '',
                name: '',
            },
            selectedAssets: [],
            isSelected: false
        });
    };

    handleExpandClick = () => {
        this.setState({expanded: !this.state.expanded})
    };

    showSelects() {
        let attributesList = [];
        let i = 0;
        if (this.state.selectedCategoryAttributes !== null) {
            this.state.selectedCategoryAttributes.forEach((attribute) => {
                if (attribute.type === "text") {
                    attributesList.push(
                        <div style={styles.content} key={i}>
                            <CreatableSelect
                                styles={{
                                    input: base => ({
                                        ...base,
                                        height: 50,
                                        paddingTop: 10
                                    }),
                                    menu: base => ({
                                        ...base,
                                        zIndex: 999
                                    }),
                                }}
                                formatCreateLabel={(inputValue) => `Add ${attribute.name} ${inputValue}`}
                                id={attribute.name}
                                name={attribute.name}
                                style={styles.creatableSelect}
                                isClearable
                                placeholder={attribute.name + (attribute.required ? ' *' : '')}
                                onChange={(newValue, action) => this.handleAttributeValuesChangeTextCallback(newValue, action, attribute.name)}
                                options={this.state.options[attribute.name]}
                            />
                        </div>
                    );
                } else {
                    attributesList.push(
                        <div style={styles.content} key={i}>
                            <TextField
                                id={attribute.name}
                                name={attribute.name}
                                type={attribute.type}
                                label={attribute.name}
                                style={styles.textField}
                                onChange={this.handleAttributeValuesChangeCallback}
                                required={attribute.required}
                                variant='outlined'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </div>
                    );
                }
                i++;
            });
        } else {
            attributesList = []
        }
        return attributesList
    }

    render() {
        const {classes} = this.props;
        const attributeList = this.showSelects();
        return (
            <div className={classes.root}>
                <SuccessSnackBar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    callback={this.handleSnackbarClose}
                />
                {!this.isLoading() ? (
                    <form className={classes.content} noValidate>
                        <div className={classes.content}>
                            <InputLabel id="selected-category-select-label">Category</InputLabel>
                            <Select className={classes.select}
                                    displayEmpty
                                    id="selected-category-select"
                                    labelId="selected-category-select-label"
                                    value={this.state.selectedCategory.id}
                                    onChange={this.handleSelectedCategoryChange}
                            >
                                {this.state.categories.map(category => {
                                        if (category.name === "All") {
                                            return <MenuItem style={{paddingLeft: category.paddingLeft}}
                                                             key={category.id}
                                                             disabled
                                                             value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        } else {
                                            return <MenuItem style={{paddingLeft: category.paddingLeft}}
                                                             key={category.id}
                                                             value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        }
                                    }
                                )}
                            </Select>
                        </div>
                        <div className={classes.content}>
                            {this.state.selectedCategory.id !== "" &&
                            <TextField inputProps={{maxLength: 68}}
                                error={this.state.assetNameError}
                                required={true}
                                className={classes.textField}
                                label={"Asset name"}
                                value={this.state.assetName}
                                onChange={this.handleAssetNameChange}
                                variant='outlined'
                                helperText={this.state.assetNameError === true ? 'Asset with that name already exists' : ''}
                            />
                            }
                        </div>
                        {attributeList}
                        {this.state.selectedCategory.id !== "" &&
                        <Card className={classes.card}>
                            <CardHeader subheader="Related assets"
                                        action={
                                            <IconButton
                                                className={clsx(classes.expand, {
                                                    [classes.expandOpen]: this.state.expanded,
                                                })}
                                                onClick={this.handleExpandClick}
                                                aria-expanded={this.state.expanded}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon/>
                                            </IconButton>
                                        }
                            />
                            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <div className={classes.content}>
                                        <FormControl>
                                            <InputLabel id="selected-category-select-label1">Category</InputLabel>
                                            <Select className={classes.selectCategory}
                                                    id="selected-category-select1"
                                                    labelId="selected-category-select-label1"
                                                    value={this.state.selectedCategoryRelated.id}
                                                    onChange={this.handleSelectedCategoryRelatedAssetChange}
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
                                        {this.state.isSelected && (

                                            <FormControl className={classes.formControl}>
                                                <InputLabel style={{paddingLeft: 30}}
                                                            id="selected-asset-select-label">Assets</InputLabel>
                                                <Select className={classes.selectAssets}
                                                        multiple
                                                        id="selected-asset-select"
                                                        labelId="selected-asset-select-label"
                                                        value={this.state.selectedAssets}
                                                        onChange={this.handleSelectedAssetsChange}
                                                        disableUnderline
                                                        input={<Input id="select-multiple-chip"/>}
                                                        renderValue={selected => (
                                                            <div className={classes.chips}>
                                                                {selected.map(value => (
                                                                    <Chip key={value.name} label={value.name}
                                                                          className={classes.chip}
                                                                          color="primary"
                                                                          onDelete={() => this.handleDeleteChip(value.name)}/>
                                                                ))}
                                                            </div>
                                                        )}
                                                >
                                                    {this.state.selectedCategoryRelatedAssets.map(asset =>
                                                        <MenuItem
                                                            key={asset.id}
                                                            value={asset}>
                                                            {asset.name}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>)}
                                    </div>
                                    <div className={classes.contentWithButton}>
                                        {this.state.isSelected &&
                                        <Button variant="contained"
                                                color="primary"
                                                className={classes.addRelatedAssetButton}
                                                onClick={this.handleSaveAttributes}
                                                disabled={this.state.selectedAssets.length === 0}
                                        >
                                            Save selected assets
                                        </Button>
                                        }
                                    </div>
                                    {this.state.relatedAssets.length !== 0 &&
                                    <div className={classes.content}>
                                        <List dense={true}>
                                            {this.state.relatedAssets.map(value => (
                                                <ListItem key={value.id}>
                                                    <ListItemText
                                                        primary={value.name}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="delete"
                                                                    onClick={() => this.handleDeleteRelatedAssets(value.name)}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>))}
                                        </List>
                                    </div>
                                    }
                                </CardContent>
                            </Collapse>
                        </Card>
                        }
                        <div className={classes.contentWithButton}>
                            < Button variant="contained"
                                     size="large"
                                     color="primary"
                                     className={classes.addAssetButton}
                                     onClick={this.handleAddAssetButton}
                                     disabled={this.state.assetNameError || this.state.attributesError || this.state.assetNameEmpty}
                            >
                                Add Asset
                            </Button>
                        </div>

                    </form>
                ) : (
                    <div className={classes.noContent}>
                        <BeatLoader
                            size={10}
                            color={"#3f51b5"}
                        />
                    </div>
                )}
            </div>
        );
    }
}

AddAsset.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAsset)