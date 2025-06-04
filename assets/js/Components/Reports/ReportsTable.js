import React from 'react'
import SortableTable from '../SortableTable'
import { View } from '@instructure/ui-view'
import { Heading } from '@instructure/ui-heading'

class ReportsTable extends React.Component {
  constructor(props) {
    super(props)

    this.headers = [
      { id: "created", text: this.props.t('label.date') },
      { id: "errors", text: this.props.t('label.plural.error') },
      { id: "suggestions", text: this.props.t('label.plural.suggestion') },
      { id: "contentFixed", text: this.props.t('label.content_fixed') },
      { id: "contentResolved", text: this.props.t('label.content_resolved') },
      { id: "filesReviewed", text: this.props.t('label.files_reviewed')}
    ];

    if (this.props.isAdmin) {
      this.headers.push({ id: "count", text: this.props.t('label.admin.courses') })
    }

    this.state = {
      tableSettings: {
        sortBy: 'created',
        ascending: false,
        pageNum: 0,
      }
    }

    this.getContent = this.getContent.bind(this)
    this.exportToCSV = this.exportToCSV.bind(this)
  }

  handleTableSettings = (setting) => {
    this.setState({
      tableSettings: Object.assign({}, this.state.tableSettings, setting)
    });
  }

  getContent() {
    let list = this.props.reports;
    const { sortBy, ascending } = this.state.tableSettings;

    list.sort((a, b) => {
      if (isNaN(a[sortBy]) || isNaN(b[sortBy])) {
        return (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) ? -1 : 1;
      }
      else {
        return (Number(a[sortBy]) < Number(b[sortBy])) ? -1 : 1;
      }
    })

    if (!ascending) {
      list.reverse();
    }

    return list;
  }

  exportToCSV() {
    const rows = this.getContent();
    const headers = this.headers.map(header => header.text);
    
    const csvData = [];
    csvData.push(headers.join(','));
    
    rows.forEach(row => {
      const rowData = this.headers.map(header => {
        const value = row[header.id];
        return `"${value}"`;
      });
      csvData.push(rowData.join(','));
    });
    
    const csvString = csvData.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'UDOITHistoryReport.csv';
    link.click();
  }

  render() {
    const rows = this.getContent();
    
    return (
      <View as="div" key="reportsTableWrapper">
        <Heading as="h3" level="h4" margin="small 0">{this.props.t('label.report_history')}</Heading>
        <SortableTable
          caption={this.props.t('udoit.reports.table.caption')}
          headers={this.headers}
          rows={rows}
          tableSettings={this.state.tableSettings}
          handleTableSettings={this.handleTableSettings}
          t={this.props.t}
        />
        <button onClick={this.exportToCSV}>Export History Table</button>
      </View>
    )
  }
}

export default ReportsTable;