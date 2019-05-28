// <copyright file="Reports.tsx" company="Quest Software Inc.">
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
import { RaisedButton, Divider, Subheader } from "material-ui";
import * as _ from "lodash";
import ReportsMenu from "./ReportsMenu";
import { Session } from "../../services/SessionServiceApi";
import { subHeaderStyle, spinnerStyle } from "../../styles/Styles";
import { IAction } from "../../types/Types";
import { UserReport, ReportServiceApi } from "../../services/ReportServiceApi";
import ReportAnalysis from "./ReportAnalysis";
require("../../styles/ReportStyles.global.scss");
const spinner = require("../../images/Spin.gif");

export interface IProps {
  reports: any;
  tags: string[];
  children: any;
  session: Session;
  handleOpenFile(id: string, unmodifiedTags: string[]): Promise<IAction>;
  handleOpenFolder(id: string, unmodifiedTags: string[]): Promise<IAction>;
  deleteReport(
    report: UserReport,
    unmodifiedTags: string[],
    api?: ReportServiceApi
  ): Promise<IAction>;
  getAllReportsBySessionFromUser(
    sessionId: string,
    api: ReportServiceApi
  ): Promise<IAction>;
  setDrawerNavigation(parentMenuKey: number, childMenuKey: number): IAction;
}
type State = {
  isLoading: boolean;
  selectedReport: string;
  fetchedReport: UserReport | null;
};
export default class Reports extends React.Component<IProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedReport: "",
      fetchedReport: null
    };

    this.moveToInterviewQuestion = this.moveToInterviewQuestion.bind(this);
    this.handleOpenFileDialog = this.handleOpenFileDialog.bind(this);
    this.handleOpenFolderDialog = this.handleOpenFolderDialog.bind(this);
    this.deleteReport = this.deleteReport.bind(this);
  }

  componentWillMount() {
    if (!this.props.session || !this.props.session.id) {
      hashHistory.push("/home");
    } else {
      this.props.setDrawerNavigation(3, 2);
    }
  }

  moveToInterviewQuestion() {
    hashHistory.push("/planning/interview-question");
  }

  async handleOpenFileDialog(event: Event, sessionId: string): Promise<void> {
    event.preventDefault();
    this.setState({ isLoading: true });
    await this.props.handleOpenFile(sessionId, this.props.tags);
    if (this.state.selectedReport) {
      const fetchedReport = this.getUserReportById(this.state.selectedReport);
      this.setState({
        fetchedReport
      });
    }
    this.setState({ isLoading: false });
  }

  async handleOpenFolderDialog(event: Event, sessionId: string): Promise<void> {
    event.preventDefault();
    this.setState({ isLoading: true });
    await this.props.handleOpenFolder(sessionId, this.props.tags);
    if (this.state.selectedReport) {
      const fetchedReport = this.getUserReportById(this.state.selectedReport);
      this.setState({
        fetchedReport
      });
    }

    this.setState({ isLoading: false });
  }

  getUserReportById(id: string): UserReport {
    return _.find(this.props.reports.reportFiles, { id });
  }
  handleReportSelect(reportId: string): void {
    const fetchedReport: UserReport = this.getUserReportById(reportId);
    this.setState(
      {
        selectedReport: reportId,
        fetchedReport
      },
      () => this.forceUpdate()
    );
  }

  async deleteReport(report: UserReport, tags: string[]): Promise<void> {
    await this.props.deleteReport(report, tags);
    if (this.state.fetchedReport && this.state.fetchedReport.id === report.id) {
      this.setState({ selectedReport: "", fetchedReport: null });
    }
  }

  render() {
    const { reports, session, tags } = this.props;

    return (
      <div className="flexbox overflow-hidden">
        <div className="menuContentLayout">
          <RaisedButton
            id="btnImportReport"
            label="Import Report"
            onClick={event => this.handleOpenFileDialog(event, session.id)}
            className="button-style"
            primary
          />
          <RaisedButton
            id="btnImportFolder"
            label="Import Folder"
            onClick={event => this.handleOpenFolderDialog(event, session.id)}
            className="button-style"
            primary
          />
          <Subheader id="lblReports" style={subHeaderStyle}>
            Reports
            {this.state.isLoading && (
              <img
                id="imgReportsLoader"
                alt="Loading..."
                src={spinner}
                style={spinnerStyle}
              />
            )}
          </Subheader>
          <Divider />
          <div className="menuStyle">
            <ReportsMenu
              reportsData={reports}
              deleteReport={this.deleteReport}
              session={session}
              tags={tags}
              getAllReportsBySessionFromUser={
                this.props.getAllReportsBySessionFromUser
              }
              handleReportSelect={reportId => this.handleReportSelect(reportId)}
              selectedReport={this.state.selectedReport}
            />
          </div>
        </div>
        <div className="flexbox menuLayout">
          <div className="width-100per">
            <div className="height-5per">
              {tags &&
                tags.length > 0 && (
                  <RaisedButton
                    id="btnMoveToQuestions"
                    label="Move to Questions"
                    onClick={() => this.moveToInterviewQuestion()}
                    className="button-style float-right"
                    primary
                  />
                )}
            </div>
            <div className="clear" />
            <div className="height-80per">
              {this.state.fetchedReport &&
                this.state.selectedReport && (
                  <ReportAnalysis
                    reportId={this.state.selectedReport}
                    reportById={this.state.fetchedReport}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

