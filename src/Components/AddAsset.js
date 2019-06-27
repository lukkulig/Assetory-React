import React from "react";
import api from "../api";
import {Grid, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import AssetCategorySelect from "./AssetCategorySelect.js";
import CreateCategoryDialog from "./CreateCategoryDialog.js"
import CategoryFieldsList from "./CategoryFieldsList.js"
import {Button, Paper} from "@material-ui/core";
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
        width: 500,
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
        assetCategory: undefined,
        categoryAttributes: []
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
        console.log("CLICK ADD ASSET")
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

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {categoryId} = this.getUrlParams(window.location);
        if (prevState.categoryId !== categoryId) {
            this.setState({categoryId: categoryId});
        }
    }

    render() {
        const {classes} = this.props;
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
                            category={this.getActiveCategory()}
                            fields={this.state.categoryAttributes}
                            // afterCloseUpdateCallback={() => this.fetchAndSetSprints(projectId)}
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