import * as PropTypes from "prop-types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, TextField,
    withStyles
} from "@material-ui/core";
import React from 'react';
import api from "../../../api";
import styles from "../Overview.styles";
import TreeMenu from 'react-simple-tree-menu';
import {ListGroup} from "reactstrap";
import ListItem from "../CategoriesTree/ListItem";

class ComputerInformation extends React.Component {

    state = {
        computerChoiceDialogOpen: false,
        chosenComputer: undefined,
        registeredComputers: [],
        report: undefined,
        reportDate: undefined,
    };

    mapReportToData(report) {
        if (report === undefined) {
            return [];
        }
        let systemData = {
            key: 'System',
            label: 'System',
            nodes: this.mapToData(report.system),
        };
        let hardwareData = {
            key: 'Hardware',
            label: 'Hardware',
            nodes: this.mapToData(report.hardware),
        };
        let softwareData = {
            key: 'Software',
            label: 'Software',
            nodes: this.mapSoftwareToData(report.software),
        };
        return [systemData, hardwareData, softwareData]
    };

    mapToData(dataMap) {
        return Object.keys(dataMap).map(parameter => {
            return {
                key: parameter,
                label: parameter + ": " + dataMap[parameter],
            }
        });
    }

    mapToFormControlLabel(computerName) {
        return (
            <FormControlLabel control={<Radio/>} label={computerName} value={computerName}/>
        )
    }

    mapSoftwareToData(softwareReport) {
        return Object.keys(softwareReport).map(record => {
            return {
                key: record,
                label: record,
                nodes: this.mapSingleSoftwareRecordToData(softwareReport[record]),
            }
        });
    }

    mapSingleSoftwareRecordToData(records) {
        return records.map(record => {
            let recordNodes = [];
            if (record.version !== '' && record.version !== null) {
                recordNodes = recordNodes.concat([{
                    key: "Version" + record.name + record.version + record.installDate,
                    label: "Version: " + record.version
                }])
            }
            if (record.installDate !== '' && record.installDate !== null) {
                recordNodes = recordNodes.concat([{
                    key: "InstallDate" + record.name + record.version + record.installDate,
                    label: "Install date: " + record.installDate,
                }])
            }
            return {
                key: record.name + record.version + record.installDate,
                label: record.name,
                nodes: recordNodes,
            };
        })
    }

    handleConnectButton = () => {
        api.fetch(
            api.endpoints.getRegisteredComputers(),
            (response) => {
                this.setState({
                    registeredComputers: response,
                    computerChoiceDialogOpen: true,
                });
            }
        );
    };

    handleComputerChoiceChange = (event) => {
        this.setState({
            chosenComputer: event.target.value,
        });
    };

    handleConfirmConnectionButton = () => {
        api.fetch(
            api.endpoints.registerComputer(this.props.assetId, this.state.chosenComputer),
            (response) => {
                this.setState({
                    computerChoiceDialogOpen: false,
                    chosenComputer: undefined,
                })
            }
        )
    };

    handleReportDateChange = (event) => {
        this.setState({
            reportDate: event.target.value,
        }, () => {
            this.getReport();
        })
    };

    getReport = () => {
        api.fetch(
            api.endpoints.getReportByComputerIdAndDate(this.props.computerId.slice(1, -1), this.state.reportDate),
            (response) => {
                this.setState({
                    report: response,
                })
            }
        ).catch((error) => {
            console.log("Report not found");
            this.setState({
                report: undefined,
            })
        })
    };

    render() {
        const {classes} = this.props;
        if (this.props.computerId === undefined || this.props.computerId === null) {
            return (
                <div>
                    <React.Fragment>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleConnectButton}
                        >
                            Connect with computer
                        </Button>
                        <Dialog
                            open={this.state.computerChoiceDialogOpen}
                        >
                            <DialogTitle id="choose-computer">Choose computer to connect</DialogTitle>
                            <DialogContent>
                                <form className={classes.form} noValidate>
                                    <FormControl>
                                        <RadioGroup name="computers-choices" value={this.state.chosenComputer}
                                                    onChange={this.handleComputerChoiceChange}>
                                            {this.state.registeredComputers.map(name => this.mapToFormControlLabel(name))}
                                        </RadioGroup>
                                    </FormControl>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button color="default"
                                        onClick={() => this.setState({computerChoiceDialogOpen: false})}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={this.handleConfirmConnectionButton}
                                    color="secondary"
                                    disabled={this.state.chosenComputer === undefined}>
                                    Connect
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                </div>
            )
        } else {
            return (
                <div style={{'text-align': 'left'}}>
                    <h6 style={{
                        'color': 'grey',
                        'font-size': '11px',
                    }}>Computer identifier</h6>
                    <p>{this.props.computerId.slice(1, -1)}</p>
                    <TextField
                        id='reportDate'
                        type='date'
                        label='Choose report date'
                        InputLabelProps={{shrink: true}}
                        onChange={this.handleReportDateChange}
                    /> <br/><br/>
                    <h6 style={{
                        'color': 'grey',
                        'font-size': '11px',
                    }}>{this.state.report === undefined ? '' : 'Report date'}</h6>
                    <p>{this.state.report === undefined ? '' : this.state.report.date}</p>
                    <h6 style={{
                        'color': 'grey',
                        'font-size': '11px',
                    }}>{this.state.report === undefined ? '' : 'Report time'}</h6>
                    <p>{this.state.report === undefined ? '' : this.state.report.time}</p>
                    <TreeMenu
                        data={this.mapReportToData(this.state.report)}
                        hasSearch={true}
                    >
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
                </div>
            )
        }
    }
}

ComputerInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    assetId: PropTypes.string.isRequired,
    computerId: PropTypes.string.isRequired,
};

export default withStyles(styles)(ComputerInformation)