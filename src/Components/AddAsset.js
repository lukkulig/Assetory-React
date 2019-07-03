import React from "react";
import api from "../api";
import {Typography} from "@material-ui/core";
import {PropTypes} from "prop-types";
import AssetCategorySelect from "./AssetCategorySelect.js";
import CategoryFieldsList from "./CategoryFieldsList.js"
import {Button} from "@material-ui/core";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {},
    content: {
        float: 'center',
        textAlign: 'center',
        paddingLeft: '25%',
    },
    sectionTitle: {
        float: "left",
        paddingRight: 25,
    },
    selectSection: {
        float: 'left',
        width: 500,
        paddingRight: 50,
    },
    selectionHeader: {
        // padding:10,
    },
    title: {
        float: 'center',
        textAlign: 'center',
        padding: 40
    },
    projectMembers: {
        float: 'left',
        marginLeft: '4%',
    },
    categorySelection: {
        float: "center",
        width: 400,
        paddingLeft: '35%',
    },
    addProjectButton: {
        marginTop: theme.spacing.unit * 3,
        width: 400,
        height: 50,
    },
    close: {
        padding: theme.spacing.unit / 2,
    },
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
        categoryAttributes: {}
    };

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategories(),
            (response) => {
                this.setState({categories: response.content});
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

    handleAddAssetButton = () => {
        const asset = {
            category: this.state.categoryId,
            name: this.state.assetName,
            attributesMap: this.state.categoryAttributes,
            localisation: this.state.localisation,
            backup: this.state.backup,
            license: this.state.license,
            value: this.state.assetValue,
            owner: this.state.owner,
            user: this.state.user
        };

        api.fetch(
            api.endpoints.addAsset(asset), (action) => {
                this.setState({
                    assetName: '',
                    localisation: '',
                    license: '',
                    owner: '',
                    user: '',
                    assetValue: '',
                    backup: '',
                    categoryAttributes: {}
                })
            }
        );
    };

    getActiveCategory() {
        return this.state.categories.find(c => parseInt(c.id) === this.state.categoryId) || null
    }

    getUrlParams(location) {
        const searchParams = new URLSearchParams(location.search);
        return {
            categoryId: parseInt(searchParams.get('category')) || undefined,
        };
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

    handleFieldsChangeCallback = (event) => {
        let temp = this.state.categoryAttributes;
        temp[event.target.name] = event.target.value;
        this.setState({categoryAttributes: temp});
    };

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {categoryId} = this.getUrlParams(window.location);
        if (prevState.categoryId !== categoryId) {
            this.setState({categoryId: categoryId});
            this.setState({categoryName: "Ala"})
        }
    }

    render() {
        const {classes} = this.props;
        const {
            assetName, localisation, license, owner, user, assetValue, backup
        } = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.title}>
                    <Typography variant="h3">
                        Add new asset
                    </Typography>
                </div>
                <div className={classes.categorySelection} align={"center"}>
                    <Typography variant="h6" component="h2" className={classes.sectionTitle}>
                        Category
                    </Typography>
                    <AssetCategorySelect
                        categories={this.state.categories.map(c => ({
                            id: parseInt(c.id),
                            name: c.name,
                            attributes: c.attributes,
                            path: c.path,
                        }))}
                        categoryChangeCallback={this.handleCategoryChange}
                        selectedCategoryId={this.state.categoryId}
                    />
                    <div className={classes.content}>
                        {this.getActiveCategory() &&
                        <CategoryFieldsList
                            assetName={assetName}
                            localisation={localisation}
                            license={license}
                            owner={owner}
                            user={user}
                            assetValue={assetValue}
                            backup={backup}
                            category={this.getActiveCategory()}
                            assetNameChangeCallback={this.handleAssetNameChange}
                            localisationChangeCallback={this.handleLocalisationChange}
                            licenseChangeCallback={this.handleLicenseChangeCallback}
                            ownerChangeCallback={this.handleOwnerChangeCallback}
                            userChangeCallback={this.handleUserChangeCallback}
                            assetValueChangeCallback={this.handleAssetValueChangeCallback}
                            backupChangeCallback={this.handleBackupChangeCallback}
                            fieldsChangeCallback={this.handleFieldsChangeCallback}
                            fields={this.state.categoryAttributes}
                        />
                        }
                    </div>
                    <div>
                        < Button
                            onClick={this.handleAddAssetButton}
                            color="primary"
                            variant="contained"
                            className={classes.addProjectButton}
                        >
                            add asset
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

AddAsset.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAsset)