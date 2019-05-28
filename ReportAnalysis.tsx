// <copyright file="ReportAnalysis.tsx" company="Quest Software Inc.">
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
import * as _ from "lodash";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import Pagination from "react-js-pagination";
import LoaderHelper from "./../LoaderHelper";
import { replaceWhiteSpace } from "../../utils/Utils";
import { UserReport } from "../../services/ReportServiceApi";
import "../../styles/ReportStyles.global.scss";

export interface IProps {
  reportId: string;
  reportById: UserReport | null;
}
type State = {
  openCreate: boolean;
  fixedHeader: boolean;
  fixedFooter: boolean;
  stripedRows: boolean;
  showRowHover: boolean;
  selectable: boolean;
  multiSelectable: boolean;
  enableSelectAll: boolean;
  deselectOnClickaway: boolean;
  showCheckboxes: boolean;
  headers: string[];
  isLoading: boolean;
  data: any;
  reportId: string;
  reportDisplayName: string;
  activePage: number;
  pageSize: number;
  totalItems: number;
  pageRange: number;
  pageData: any;
};
export default class ReportAnalysis extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      openCreate: false,
      fixedHeader: false,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      headers: [],
      isLoading: false,
      data: [],
      reportId: "",
      reportDisplayName: "",
      activePage: 1,
      pageSize: 12,
      totalItems: 0,
      pageRange: 5,
      pageData: []
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillReceiveProps(newProperties) {
    const reportId = newProperties.reportId;
    if (reportId && newProperties.reportById) {
      const stateArray: UserReport = this.state.data.sort();
      const propsArray: UserReport = newProperties.reportById.metadata.data.sort();
      const isSame =
        _.isEqual(stateArray, propsArray) &&
        this.state.reportDisplayName === newProperties.reportById.friendlyName;
      if (!isSame) {
        this.setState({ reportId, isLoading: true });
        this.getReportsData(newProperties.reportById);
      }
    }
  }

  getPageData(currentPage: number): any {
    const skip = this.state.pageSize * (currentPage - 1);
    const take = this.state.pageSize + skip;
    if (this.state.data.length !== 0) {
      return this.state.data.slice(skip, take);
    }
    return this.state.data;
  }

  getReportsData(reportObj: UserReport): void {
    this.setState(
      {
        reportDisplayName: reportObj.friendlyName,
        headers: reportObj.metadata.headers,
        data: reportObj.metadata.data,
        activePage: 1
      },
      (): void => {
        if (reportObj.metadata.data.length > 0) {
          this.setState({ totalItems: reportObj.metadata.data.length });
          const pageDataItems = this.getPageData(this.state.activePage);
          this.setState({ pageData: pageDataItems });
        }
        this.setState({ isLoading: false });
      }
    );
  }

  handlePageChange(pageNumber: number): void {
    this.setState({
      activePage: pageNumber,
      pageData: this.getPageData(pageNumber)
    });
  }

  render() {
    if (this.state.isLoading) {
      return <LoaderHelper />;
    }
    if (this.state.headers.length === 0 && this.state.data.length === 0) {
      return (
        <div className="report-header">
          {this.state.reportDisplayName} Analysis
          <h4>No records found</h4>
        </div>
      );
    }
    return (
      <div>
        <div
          id={`lbl${replaceWhiteSpace(this.state.reportDisplayName)}`}
          className="report-header"
        >
          {this.state.reportDisplayName} Analysis
        </div>
        <div className="tableLayout">
          <Table
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            style={{ tableLayout: "auto", paddingTop: "5px" }}
          >
            <TableHeader
              displaySelectAll={this.state.showCheckboxes}
              adjustForCheckbox={this.state.showCheckboxes}
              enableSelectAll={this.state.enableSelectAll}
            >
              <TableRow key="tableHeader">
                {this.state.headers.map(header => (
                  <TableHeaderColumn key={header} className="tableHeader">
                    {header}
                  </TableHeaderColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={this.state.showCheckboxes}
              deselectOnClickaway={this.state.deselectOnClickaway}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}
            >
              {this.state.pageData.map(records => (
                <TableRow>
                  {records.children.map(record => (
                    <TableRowColumn key={record.content}>
                      {record.content}
                    </TableRowColumn>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {this.state.pageData &&
          this.state.pageData.length > 0 &&
          this.state.data.length > this.state.pageSize && (
            <div id="divReportPagination" className="paginationAlignment">
              <Pagination
                prevPageText="prev"
                nextPageText="next"
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.pageSize}
                totalItemsCount={this.state.totalItems}
                pageRangeDisplayed={this.state.pageRange}
                onChange={this.handlePageChange}
              />
            </div>
          )}
      </div>
    );
  }
}

