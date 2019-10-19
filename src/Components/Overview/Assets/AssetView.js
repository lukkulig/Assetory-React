import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import {DatePicker} from '@atlaskit/datetime-picker';
import styled from 'styled-components';
import {fontSize, gridSize} from '@atlaskit/theme';


const styles = ({
    title: {
        marginRight: 5
    },
    titleTag: {},
    deleteButton: {
        float: "right",
    },
    grid: {
        float: "left",
    },
    field: {
        width: '200px'
    }
});

const ReadViewContainer = styled.div`
  display: flex;
  font-size: ${fontSize()}px;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

class AssetView extends React.Component {

    state = {
        editValue: "2018-01-02",
        attributes: []
    };

    componentDidMount() {
        this.setState({attributes: this.props.asset.attributes})
    }

    render() {
        const {classes, asset} = this.props;

        let i = 0;
        const attributesEditable = [];
        let pattern = /(\d{2})-(\d{2})-(\d{4})/;
        this.state.attributes.forEach((attr) => {
            if (attr.attribute.type === "date") {
                console.log(attr.value);
                console.log(attr.value.replace(pattern, '$3-$2-$1'));
            }
            attributesEditable.push(
                <InlineEdit className={classes.field} key={i}
                            defaultValue={(attr.attribute.type !== "date") ? attr.value : attr.value.replace(pattern, '$3-$2-$1')}
                            label={attr.attribute.name}
                            editView={fieldProps => (attr.attribute.type !== "date") ?
                                <Textfield {...fieldProps} type={attr.attribute.type} autoFocus/>
                                :
                                <DatePicker {...fieldProps} autoFocus/>
                            }
                            readView={() => (
                                <ReadViewContainer>
                                    {((attr.attribute.type !== "date") ? attr.value : attr.value.replace(pattern, '$3-$2-$1')) || 'Click to enter value'}
                                </ReadViewContainer>
                            )}
                            onConfirm={value => this.setState(prevState => ({
                                attributes: prevState.attributes.map(
                                    el => el.attribute === attr.attribute ? {...el, value: value} : el
                                )
                            }))}
                            readViewFitContainerWidth
                            keepEditViewOpenOnBlur
                />
            );
            i++;
        });

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography className={classes.title} variant="h6">
                        {asset.name}
                    </Typography>
                    <Typography className={classes.titleTag} variant="overline" color="textSecondary">
                        {asset.category}
                    </Typography>
                </ExpansionPanelSummary>
                <Divider/>
                <ExpansionPanelDetails>
                    <List dense component={"ul"}>
                        {attributesEditable}
                    </List>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <Button size="small" color="secondary" variant="outlined">
                        Delete
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
}

AssetView.propTypes = {
    classes: PropTypes.object.isRequired,
    asset: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
    }).isRequired,
};

export default withStyles(styles)(AssetView)