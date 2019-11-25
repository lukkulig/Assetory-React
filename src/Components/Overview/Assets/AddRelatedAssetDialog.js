import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Add} from "@material-ui/icons";
import api from "../../../api";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {MenuItem, Select} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";

const styles = ({
    addIconButton: {
        float: 'right',
        marginRight: '-12px'
    },
    content: {
        width: 600,
        height: 'max-content'
    },
    selectCategory: {
        textAlign: 'left',
        paddingRight: 10,
        paddingBottom: 10,
        width: 200,
    },
    formControl: {
        paddingLeft: 20
    },
    selectAssets: {
        textAlign: 'left',
        paddingLeft: 10,
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
});

class AddRelatedAssetDialog extends React.Component {

    state = {
        open: false,
        relatedAssets: [],
        categories: [],
        selectedCategoryRelated: {
            id: '',
            name: '',
        },
        selectedAssets: [],
        selectedCategoryRelatedAssets: [],
        isSelected: false
    };

    componentDidMount() {
        let preparedCategories = this.prepareCategories(this.props.categories, 15);
        this.setState({categories: preparedCategories, relatedAssets: this.props.relatedAssets});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            let preparedCategories = this.prepareCategories(this.props.categories, 15);
            this.setState({categories: preparedCategories, relatedAssets: this.props.relatedAssets});
        }
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

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({
            open: false,
            selectedCategoryRelated: {
                id: '',
                name: '',
            },
            selectedAssets: [],
            isSelected: false
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

    findCategory = (categoryId) => {
        let foundCategory = this.state.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
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

    handleSaveRelatedAssets = () => {
        this.handleClose();
        let related = this.state.relatedAssets;
        let selected = [];
        this.state.selectedAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            categoryId: asset.categoryId
        })).forEach(asset => {
            let duplicated = false;
            this.state.relatedAssets.forEach(selected => {
                if (JSON.stringify(selected) === JSON.stringify(asset))
                    duplicated = true;
            });
            if (!duplicated)
                selected.push(asset);
        });
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
        this.props.assetViewCallback(related);
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                Related Assets
                <Tooltip className={classes.addIconButton}
                         title="Add new related asset">
                    <IconButton onClick={this.handleClickOpen}>
                        <Add/>
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="add-related-asset-form"
                >
                    <DialogTitle id="add-related-asset-form">Add Related Assets</DialogTitle>
                    <DialogContent className={classes.content}>
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSaveRelatedAssets} color="primary"
                                disabled={this.state.selectedAssets.length === 0}>
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

AddRelatedAssetDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    relatedAssets: PropTypes.array.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.object,
            subCategories: PropTypes.array
        })
    ),
    assetViewCallback: PropTypes.func.isRequired
};

export default withStyles(styles)(AddRelatedAssetDialog);