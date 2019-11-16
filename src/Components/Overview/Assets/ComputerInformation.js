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
    RadioGroup,
    withStyles
} from "@material-ui/core";
import styles from "../Overview.styles";
import React from 'react';
import api from "../../../api";
import TreeMenu from 'react-simple-tree-menu';


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
            return {
                key: record.name + record.version + record.installDate,
                label: "Name: " + record.name + ", version: " + record.version + ", install date: " + record.installDate,
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

    getTodayDate = () => {
        let date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    };

    getReport = (date) => {
        if (date !== this.state.reportDate) {
            this.setState({reportDate: date},
                () => {
                    api.fetch(
                        api.endpoints.getReportByComputerIdAndDate(this.props.computerId.slice(1, -1), date),
                        (response) => {
                            this.setState({
                                report: response,
                            })
                        }
                    )
                })
        }
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
            this.getReport(this.getTodayDate());
            return (
                <div>
                    Computer identifier: {this.state.report === undefined ? "" : this.state.report.computerId} <br/>
                    Report date: {this.state.report === undefined ? "" : this.state.report.date} <br/>
                    Report time: {this.state.report === undefined ? "" : this.state.report.time} <br/>
                    <TreeMenu
                        data={this.mapReportToData(this.state.report)}
                        hasSearch={true}
                    />
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