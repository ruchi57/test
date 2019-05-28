// <copyright file="ReportMenuItem.tsx" company="Quest Software Inc.">
// -----------------------------------------------------------------------
// © 2018 Quest Software Inc.
// ALL RIGHTS RESERVED.
//
// This software is the confidential and proprietary information of
// Quest Software Inc. ("Confidential Information"). You shall not
// disclose such Confidential Information and shall use it only in
// accordance with the terms of the license agreement you entered
// into with Quest Software Inc.
//
// QUEST SOFTWARE INC. MAKES NO REPRESENTATIONS OR
// WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
// EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
// TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
// QUEST SOFTWARE INC. SHALL NOT BE LIABLE FOR ANY DAMAGES
// SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING
// OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES
// -----------------------------------------------------------------------
// </copyright>

import * as React from "react";
import { hashHistory } from "react-router";
import { SvgIcon, FlatButton, Dialog, ListItem, Divider } from "material-ui";
import { grey400, blue300 } from "material-ui/styles/colors";
import { UserReport, ReportServiceApi } from "../../services/ReportServiceApi";
import { commonButtonStyle, deleteIconStyles } from "../../styles/Styles";
import { replaceWhiteSpace } from "../../utils/Utils";
require("../../styles/ReportStyles.global.scss");

export interface IProps {
  reportName: UserReport;
  isSelected: boolean;
  reportId: string;
  tags: string[];
  deleteReport(
    report: UserReport,
    unmodifiedTags: string[],
    api?: ReportServiceApi
  ): Promise<void>;
  handleReportSelect(reportId: string): void;
}

type state = {
  open: boolean;
};
export default class ReportMenuItem extends React.Component<IProps, state> {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleOpenDeleteDialog = (event: Event): void => {
    event.preventDefault();
    this.setState({ open: true });
  };

  handleCloseDeleteDialog = (): void => {
    this.setState({ open: false });
  };

  handleDelete(event: Event, report: UserReport): void {
    event.preventDefault();
    this.setState({ open: false });
    this.props.deleteReport(report, this.props.tags);
    hashHistory.push("/reports");
  }

  handleClick(event: Event): void {
    event.preventDefault();
    this.props.handleReportSelect(this.props.reportId);
  }

  render() {
    const actions = [
      <FlatButton
        id="btnCancel"
        label="Cancel"
        style={commonButtonStyle}
        backgroundColor="#2196F7"
        hoverColor="#76BCF2"
        rippleColor="#2196F7"
        onClick={this.handleCloseDeleteDialog}
      />,
      <FlatButton
        id="btnYes"
        label="Yes"
        keyboardFocused={true}
        style={commonButtonStyle}
        backgroundColor="#2196F7"
        hoverColor="#76BCF2"
        rippleColor="#2196F7"
        onClick={event => this.handleDelete(event, this.props.reportName)}
      />
    ];
    const isSelected = this.props.isSelected
      ? { wordWrap: "break-word", backgroundColor: "#e2e2e2" }
      : { wordWrap: "break-word" };
    return (
      <div>
        <ListItem
          id={`li${replaceWhiteSpace(this.props.reportName.friendlyName)}`}
          style={isSelected}
          onClick={this.handleClick}
          primaryText={this.props.reportName.friendlyName}
          rightIconButton={
            <SvgIcon
              id={`delReports${replaceWhiteSpace(
                this.props.reportName.friendlyName
              )}`}
              style={deleteIconStyles}
              color={grey400}
              onClick={this.handleOpenDeleteDialog}
              hoverColor={blue300}
            >
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </SvgIcon>
          }
        />
        <Divider />
        <Dialog
          id="dlgDeleteReport"
          modal={false}
          title="Delete Report?"
          onRequestClose={this.handleCloseDeleteDialog}
          open={this.state.open}
          actions={actions}
          titleStyle={{ backgroundColor: "#2196F3", color: "#FFF" }}
        >
          <div className="dialogContent">
            Are you sure you want to delete this report?
          </div>
        </Dialog>
      </div>
    );
  }
}

