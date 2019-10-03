import React from "react";
import * as PropTypes from "prop-types";
import {withStyles, List, ListItem, Paper, Button, TextField, Select, MenuItem} from "@material-ui/core";

const styles = ({
    attributesListBox: {
        maxHeight: 280,
        overflow: 'auto',
    },
    textField: {
        width: 720,
    },
    attributeContent: {
        float: 'left',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
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
        const {classes} = this.props;
        let i = 0;
        const attributesList = [];
        if (this.props.supercategoryAttributes !== undefined) {
            this.props.supercategoryAttributes.forEach((attribute) => {
                attributesList.push(
                    <div key={i}>
                        {AttributeListItem(attribute.name, attribute.type)}
                        <br/>
                    </div>
                );
            });
        }
        this.props.attributes.forEach((attribute) => {
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
            i++;
        });

        return (
            <div>
                <div className={classes.attributeContent}>
                    <TextField
                        error={this.props.attributeNameError}
                        className={classes.textField}
                        label={"Additional attribute"}
                        value={this.props.newAttributeName}
                        onChange={this.props.attributeNameChangeCallback}
                        variant="outlined"
                        helperText={this.props.attributeNameError === true ? 'There is already attribute with that name in this category' : 'Attribute required for all assets in this category'}
                    />
                </div>
                <div className={classes.attributeContent}>
                    <Select
                        className={classes.select}
                        value={this.props.newAttributeType}
                        onChange={this.props.attributeTypeChangeCallback}
                    >
                        <MenuItem value={"text"}>Text</MenuItem>
                        <MenuItem value={"number"}>Number</MenuItem>
                        <MenuItem value={"date"}>Date</MenuItem>
                    </Select>
                </div>
                <div className={classes.attributeContent}>
                    <Button variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={this.props.saveAttributeCallback}
                            disabled={this.props.attributeNameError}
                    >
                        Save attribute
                    </Button>
                </div>
                <Paper className={classes.attributesListBox} style={{clear: "both"}}>
                    <List component={"ul"}>
                        {attributesList}
                    </List>
                </Paper>
            </div>
        )
    }
}

CategoryAttributes.propTypes = {
    classes: PropTypes.object.isRequired,
    attributes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })).isRequired,
    supercategoryAttributes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    })).isRequired,
    newAttributeName: PropTypes.string.isRequired,
    newAttributeType: PropTypes.string.isRequired,
    attributeNameChangeCallback: PropTypes.func.isRequired,
    attributeTypeChangeCallback: PropTypes.func.isRequired,
    saveAttributeCallback: PropTypes.func.isRequired,
    deleteAttributeCallback: PropTypes.func.isRequired,
};

export default withStyles(styles)(CategoryAttributes)
