// <copyright file="ReportsMenu.tsx" company="Quest Software Inc.">
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
import { List } from "material-ui";
import { hashHistory } from "react-router";
import ReportMenuItem from "./ReportMenuItem";
import { Session } from "../../services/SessionServiceApi";
import { IAction } from "../../types/Types";
import { UserReport, ReportServiceApi } from "../../services/ReportServiceApi";

require("../../styles/ReportStyles.global.scss");

export interface IProps {
  reportsData: any;
  session: Session;
  tags: string[];
  selectedReport: string;
  deleteReport(
    report: UserReport,
    tags: string[],
    api?: ReportServiceApi
  ): Promise<void>;
  getAllReportsBySessionFromUser(
    sessionId: string,
    api?: ReportServiceApi
  ): Promise<IAction>;
  handleReportSelect(reportId: string): void;
}

export default class ReportsMenu extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.props.session || !this.props.session.id) {
      hashHistory.push("/home");
    } else {
      this.props.getAllReportsBySessionFromUser(this.props.session.id);
    }
  }

  render() {
    if (this.props.reportsData.reportFiles) {
      const reportsList = this.props.reportsData.reportFiles.map(report => (
        <ReportMenuItem
          handleReportSelect={this.props.handleReportSelect}
          isSelected={this.props.selectedReport === report.id}
          key={report.id}
          reportId={report.id}
          reportName={report}
          deleteReport={this.props.deleteReport}
          tags={this.props.tags}
        />
      ));
      return (
        <div>
          <List id="lstReports" className="pad0">
            {reportsList}
          </List>
        </div>
      );
    }
    return <div />;
  }
}

