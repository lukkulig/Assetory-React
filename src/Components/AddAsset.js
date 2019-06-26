import React from "react";
import api from "../api";
import {Grid, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import AssetCategorySelect from "./AssetCategorySelect";
import CreateCategoryDialog from "./CreateCategoryDialog"
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    root: {},
    content: {
        float: 'center',
        textAlign: 'center',
        padding: theme.spacing.unit * 3,
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
    projectConfig: {
        float: 'right',
        marginRight: '4%',
    },
    projectMembers: {
        float: 'left',
        marginLeft: '4%',
    },
    categorySelection: {
        clear: "left",
        marginRight: 50,
        width: "100%",
    },
    addProjectButton: {
        marginTop: theme.spacing.unit * 3,
        float: 'center',
        width: 400,
        height: 50,
    },
    close: {
        padding: theme.spacing.unit / 2,
    },
    dialogCreateSprint: {
        float: "right",
    },
    singleSelectionContainer: {
        clear: "left",
        paddingBottom: 30,
    },
});

class AddAsset extends React.Component {
    state = {
        categories: [],
        categoryId: undefined,
        categoryName:undefined,
        assetCategory: undefined,
        categoryAttributes: []
    };

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategories(),
            (response) => {
                this.setState({categories: response});
                document.body.style.cursor = 'default';
            });
    }

    handleCategoryChange = (categoryId) => {
        if (categoryId !== this.state.categoryId) {
            if (categoryId === null) {
                this.props.history.push('/overview')
            } else {
                this.props.history.push(`/overview?project=${categoryId}`)
            }
        }
    };

    handleAddAssetButton = () => {
    };

    getActiveProject() {
        return this.state.categories.find(c => c.categoryId === this.state.categoryId) || null
    }

    render() {
        const {classes} = this.props;
        const {categoryId, categoryName, assetCategory, categoryAttributes} = this.state;
        return (
            <div className={classes.root}>
                <Grid container spacing={0} justify='center'>
                    <Grid item xs={12}>
                        <div className={classes.title}>
                            <Typography variant="h3">
                                Add new asset
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.singleSelectionContainer}>
                            <div className={classes.selectionHeader}>
                                <Typography variant="h6" component="h2" className={classes.sectionTitle}>
                                    Category
                                </Typography>
                                    <div className={classes.dialogCreateSprint}>
                                        <CreateCategoryDialog
                                            category={this.getActiveProject()}
                                            parentUpdateCallback={() => this.fetchAndSetCategories(categoryId)}
                                            disabled={false}
                                            defaultStartDate={new Date()}
                                            history={this.props.history}
                                        />
                                    </div>
                            </div>
                        </div>
                        <div className={classes.categorySelection}>
                            <AssetCategorySelect
                                categories={this.state.categories.map(c => ({
                                    id: c.categoryId,
                                    name: c.categoryName,
                                    attributes: c.categoryAttributes
                                }))}
                                projectChangeCallback={this.handleCategoryChange}
                                selectedProjectId={this.state.categoryId}
                            />
                        </div>
                        <Button
                            onClick={this.handleAddAssetButton}
                            color="primary"
                            variant="contained"
                            className={classes.addProjectButton}
                        >
                            add project
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

AddAsset.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAsset)