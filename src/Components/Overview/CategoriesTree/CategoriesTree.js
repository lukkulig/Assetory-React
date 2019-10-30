import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TreeMenu from 'react-simple-tree-menu';
import {ListGroup} from 'reactstrap';
import ListItem from "./ListItem";
import {BeatLoader} from "react-spinners";


const styles = ({
    root: {
        height: "100%",
        display: 'grid',
        gridTemplateRows: '40px 10px auto',
        gridTemplateAreas: `'header'
                            'divider'
                            'content'`,
    },
    header: {
        gridArea: 'header',
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    divider: {
        gridArea: 'divider',
    },
    treeSection: {
        gridArea: 'content',
        overflow: 'auto',
        scrollPaddingRight: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    noContent: {
        width: "100%",
        textAlign: "center",
        paddingTop: 10
    }
});

class CategoriesTree extends React.Component {

    mapToData(categories) {
        return categories.map(c => ({
            key: c.category.id,
            label: c.category.name,
            nodes: (Object.keys(c.subCategories).length !== 0) ? this.mapToData(c.subCategories) : []
        }));
    }

    handleChange = key => {
        const pattern = new RegExp("/?([^/]+$)");
        const categoryId = pattern.exec(key)[1];
        this.props.categoryChangeCallback(categoryId);
    };

    getIdIfHasChildren(categories, prefix) {
        let ids = [];
        categories.forEach((category) => {
            if (Array.isArray(category.subCategories) && category.subCategories.length) {
                ids.push(prefix + category.category.id);
                let subCategoriesIds = this.getIdIfHasChildren(category.subCategories, prefix + category.category.id + "/");
                ids = ids.concat(subCategoriesIds);
            }
        });
        return ids;
    }

    isLoading() {
        return this.props.categories === null
            || this.props.initialSelectedCategoryId === null;
    }

    render() {
        const {classes, categories, initialSelectedCategoryId} = this.props;

        let initialOpenCategories = [];
        if (!this.isLoading()) {
            initialOpenCategories = this.getIdIfHasChildren(categories, "");
        }

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5">
                        Categories
                    </Typography>
                </div>
                <Divider className={classes.divider}/>
                <div className={classes.treeSection}>
                    {!this.isLoading() ? (
                        <TreeMenu
                            data={this.mapToData(categories)}
                            hasSearch={false}
                            initialActiveKey={initialSelectedCategoryId}
                            initialOpenNodes={initialOpenCategories}
                            onClickItem={({key}) =>
                                this.handleChange(key)
                            }>
                            {({items}) => (
                                <>
                                    <ListGroup>
                                        {items.map(({...props}) => (
                                            <ListItem {...props} />
                                        ))}
                                    </ListGroup>
                                </>
                            )}
                        </TreeMenu>
                    ) : (
                        <div className={classes.noContent}>
                            <BeatLoader
                                size={10}
                                color={"#3f51b5"}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

CategoriesTree.propTypes = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.object,
            subCategories: PropTypes.array
        })
    ),
    categoryChangeCallback: PropTypes.func,
    initialSelectedCategoryId: PropTypes.string,
};

export default withStyles(styles)(CategoriesTree)