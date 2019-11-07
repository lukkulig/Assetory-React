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
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import {DatePicker} from '@atlaskit/datetime-picker';
import Paper from "@material-ui/core/Paper";
import DeleteAssetDialog from "./DeleteAssetDialog";
import api from "../../../api";

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
    expansionPanelDetails: {
        padding: '25px 50px',
        display: 'grid',
        gridTemplateColumns: '200px auto',
        gridTemplateAreas: `'form rest'`,
        gridColumnGap: 50
    },
    form: {
        gridArea: 'form'
    },
    inlineEdit: {
        paddingBottom: 10,
    },
    field: {
        width: '200px'
    },
    readViewContainer: {
        display: 'flex',
        fontSize: '14px',
        lineHeight: '1.5',
        maxWidth: '100%',
        minHeight: '40px',
        padding: '8px 6px',
        wordBreak: 'break-word',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        borderColor: 'whitesmoke',
        borderRadius: '3px',
        borderWidth: '2px',
        borderStyle: 'solid',
    },
    rest: {
        gridArea: 'rest',
        backgroundColor: 'whitesmoke',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    expansionPanelActions: {
        float: 'left',
        paddingLeft: 20
    }
});

class AssetView extends React.Component {

    state = {
        attributes: []
    };

    componentDidMount() {
        this.setState({attributes: this.props.asset.attributes})
    }

    static getAttributeValuesWithColor(attr) {
        if (attr.value) {
            if (attr.attribute.type !== "date") {
                return {value: attr.value, textColor: 'default'};
            } else {
                return {value: new Date(attr.value).toLocaleDateString(), textColor: 'default'};
            }
        } else if (attr.attribute.required) {
            return {value: 'Please fill in this field', textColor: 'red'};
        }
        return {value: '', textColor: 'default'};
    }

    handleUpdateAssetAttributes = (attr, value) => {
        let attributesUpdate = {
            id: this.props.asset.id,
            attributes: {}
        };
        attributesUpdate.attributes[attr.name] = value;

        this.setState(prevState => ({
            attributes: prevState.attributes.map(
                el => el.attribute === attr ? {...el, value: value} : el
            )
        }));

        api.fetch(
            api.endpoints.updateAssetAttributes(attributesUpdate), () => {
                this.props.assetsUpdateCallback(attributesUpdate.attributes);
            }
        );

    };

    handleDeleteAsset = () => {
        this.props.assetsDeleteCallback();
    };

    render() {
        const {classes, asset} = this.props;
        const language = navigator.language;
        const attributesEditable = [];
        this.state.attributes.forEach((attr, i) => {
            let {value, textColor} = AssetView.getAttributeValuesWithColor(attr);
            attributesEditable.push(
                <div className={classes.inlineEdit} key={i}>
                    <InlineEdit
                        defaultValue={attr.value}
                        label={attr.attribute.name}
                        isRequired={attr.attribute.required}
                        editView={fieldProps => (attr.attribute.type !== "date") ?
                            <Textfield {...fieldProps} className={classes.field} type={attr.attribute.type}
                                       autoFocus/>
                            :
                            <DatePicker {...fieldProps} className={classes.field} locale={language} autoFocus/>
                        }
                        readView={() => (
                            <div className={classes.readViewContainer}
                                 style={{color: textColor}}>
                                {value}
                            </div>
                        )}
                        onConfirm={(value) => this.handleUpdateAssetAttributes(attr.attribute, value)}
                        readViewFitContainerWidth
                        keepEditViewOpenOnBlur
                    />
                </div>
            );
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
                <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                    <List className={classes.form} dense component={"ul"}>
                        {attributesEditable}
                    </List>
                    <Paper className={classes.rest}>
                        Tu mogłoby coś być, ale jeszcze nie ma :(
                    </Paper>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions className={classes.expansionPanelActions}>
                    <DeleteAssetDialog
                        assetId={asset.id}
                        assetName={asset.name}
                        assetViewCallback={this.handleDeleteAsset}
                    />
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
}

AssetView.propTypes = {
    classes: PropTypes.object.isRequired,
    asset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
    }).isRequired,
    assetsUpdateCallback: PropTypes.func.isRequired,
    assetsDeleteCallback: PropTypes.func.isRequired
};

export default withStyles(styles)(AssetView)