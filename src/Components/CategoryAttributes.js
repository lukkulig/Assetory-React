import React from "react";
import * as PropTypes from "prop-types";
import {withStyles, List, ListItem, Paper, Button} from "@material-ui/core";

const styles = ({
    attributesListBox: {
        maxHeight: 280,
        overflow: 'auto',
    },
});

const AttributeListItem = (name, type) => {
    return (
        <ListItem component={"li"} style={{float: "left"}}>
            {name + " (" + type + ")"}
        </ListItem>
    )
};

class CategoryAttributes extends React.Component {
    render() {
        const {classes, attributes} = this.props;
        let i = 0;
        const attributesList = [];
        attributes.forEach((attribute) => {
            attributesList.push(
                <div key={i}>
                    {AttributeListItem(attribute.name, attribute.type)}
                    <Button style={{float: "left"}}
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            onClick={() => this.props.deleteAttributeCallback(attribute.name)}
                    >
                        Delete
                    </Button>
                    <br/>
                </div>
            );
        });

        return (
            <Paper className={classes.attributesListBox}>
                <List component={"ul"}>
                    {attributesList}
                </List>
            </Paper>
        )
    }
}

CategoryAttributes.propTypes = {
    classes: PropTypes.object.isRequired,
    attributes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })).isRequired
};

export default withStyles(styles)(CategoryAttributes)
