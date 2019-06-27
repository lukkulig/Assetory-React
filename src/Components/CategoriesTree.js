import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TreeMenu from 'react-simple-tree-menu';
import TreeViewMenu from 'react-simple-tree-menu';
import ListGroup from 'react-simple-tree-menu';
import Input from 'react-simple-tree-menu';
import ListItem from 'react-simple-tree-menu';


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
        marginLeft: 10,
        marginBottom: 10,
    },
    grid: {
        float: "left",
    },
    gridItem: {
        marginLeft: 10,
        marginRight: 10,
    }
});

class CategoriesTree extends React.Component {

    render() {
        const {classes} = this.props;

        const treeData = {
            'first-level-node-1': {               // key
                label: 'Node 1 at the first level',
                index: 0, // decide the rendering order on the same level
                      // any other props you need, e.g. url
                nodes: {
                    'second-level-node-1': {
                        label: 'Node 1 at the second level',
                        index: 0,
                        nodes: {
                            'third-level-node-1': {
                                label: 'Node 1 at the third level',
                                index: 0,
                                nodes: {} // you can remove the nodes property or leave it as an empty array
                            },
                        },
                    },
                },
            },
            'first-level-node-2': {
                label: 'Node 2 at the first level',
                index: 1,
            },
        };

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Categories
                    </Typography>
                </div>
                <Grid className={classes.grid} container spacing={2} justify="flex-start" alignItems="flex-start">
                    <Grid className={classes.gridItem} item xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>
                    <Grid className={classes.gridItem} item xs={12}>
                        <div>
                            {/*<TreeViewMenu*/}
                            {/*    data={treeData}*/}
                            {/*    onClickItem={({ key, label, ...props }) => {*/}
                            {/*        //this.navigate(props.url); // user defined prop*/}
                            {/*    }}*/}
                            {/*    debounceTime={125}>*/}
                            {/*    {({ search, items }) => (*/}
                            {/*        <>*/}
                            {/*            <Input onChange={e => search(e.target.value)} placeholder="Type and search" />*/}
                            {/*            <ListGroup>*/}
                            {/*                {items.map(props => (*/}
                            {/*                    // You might need to wrap the third-party component to consume the props*/}
                            {/*                    // check the story as an example*/}
                            {/*                    // https://github.com/iannbing/react-simple-tree-menu/blob/master/stories/index.stories.js*/}
                            {/*                    <ListItem {...props} />*/}
                            {/*                ))}*/}
                            {/*            </ListGroup>*/}
                            {/*        </>*/}
                            {/*    )}*/}
                            {/*</TreeViewMenu>*/}
                            <TreeMenu data={treeData} />
                        </div>
                    </Grid>
                </Grid>

            </div>
        );
    }
}

CategoriesTree.propTypes = {
    classes: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    selectedCategoryId: PropTypes.string.isRequired,
};

export default withStyles(styles)(CategoriesTree)