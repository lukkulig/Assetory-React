import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TreeMenu from 'react-simple-tree-menu';
import {ListGroup, ListGroupItem} from 'reactstrap';
import AddCircleOutline from "@material-ui/icons/AddCircleOutline"
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline"

const styles = ({
    root: {
        width: "100%",
        float: "left",
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    header: {
        float: "left",
        width: "100%",
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
    },
    grid: {
        float: "left",
    },
    gridItem: {
        marginLeft: 10,
        marginRight: 10,
    },
});

const DEFAULT_PADDING = 16;
const ICON_SIZE = 29;
const LEVEL_SPACE = 30;
const ToggleIcon = ({on}) =>
    on ? <RemoveCircleOutline style={{marginRight: 5}} fontSize='small'/> :
        <AddCircleOutline style={{marginRight: 5}} fontSize='small'/>;

const ListItem = ({
                      level = 0,
                      hasNodes,
                      isOpen,
                      label,
                      searchTerm,
                      openNodes,
                      toggleNode,
                      matchSearch,
                      focused,
                      ...props
                  }) => (
    <ListGroupItem
        {...props}
        style={{
            paddingLeft: DEFAULT_PADDING + ICON_SIZE + level * LEVEL_SPACE,
            cursor: 'pointer',
            boxShadow: focused ? '0px 0px 5px 0px #222' : 'none',
            zIndex: focused ? 999 : 'unset',
            position: 'relative',
            textAlign: 'left'
        }}
    >
        {hasNodes && (
            <div
                style={{display: 'inline-block'}}
                onClick={e => {
                    hasNodes && toggleNode && toggleNode();
                    e.stopPropagation();
                }}
            >
                <ToggleIcon on={isOpen}/>
            </div>
        )}
        {label}
    </ListGroupItem>
);

class CategoriesTree extends React.Component {

    mapToData(categories) {
        return categories.map(c => ({
            key: c.category.id,
            label: c.category.name,
            nodes: (Object.keys(c.subCategories).length !==0) ? this.mapToData(c.subCategories) : []
        }));
    }

    handleChange = key => {
        const pattern = new RegExp("/?([^/]+$)");
        const categoryId = pattern.exec(key)[1];
        this.props.categoryChangeCallback(categoryId);
    };

    render() {
        const {classes, categories, selectedCategoryId} = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Categories
                    </Typography>
                </div>
                <Grid className={classes.grid} container spacing={2} justify="flex-start" alignItems="flex-start">
                    <Grid className={classes.gridItem} item xs={12}>
                        <Divider className={classes.divider} component={"hr"}/>
                    </Grid>
                    <Grid className={classes.gridItem} item xs={12}>
                        <div>
                            <TreeMenu
                                data={this.mapToData(categories)}
                                hasSearch={false}
                                initialActiveKey={selectedCategoryId}
                                onClickItem={({key}) =>
                                    this.handleChange(key)
                                }>
                                {({items}) => (
                                    <>
                                        <ListGroup>
                                            {items.map(({reset, ...props}) => (
                                                <ListItem {...props} />
                                            ))}
                                        </ListGroup>
                                    </>
                                )}
                            </TreeMenu>
                        </div>

                    </Grid>
                </Grid>

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
    ).isRequired,
    categoryChangeCallback: PropTypes.func,
    selectedCategoryId: PropTypes.string.isRequired,
};

export default withStyles(styles)(CategoriesTree)