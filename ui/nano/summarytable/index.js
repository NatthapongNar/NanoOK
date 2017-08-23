import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss'
import { Table, Icon, Select, Button, Checkbox, Tooltip, Form } from 'antd';
import _ from 'lodash'
import FontAwesome from 'react-fontawesome'

import ModalSaleSummary from '../modal_sale_summary'

import {
    setOpenExitingMarketMarker,
    selectMarkerByCA
} from '../actions/nanomaster'

const FormItem = Form.Item
const { Option, OptGroup } = Select;

class SummaryTable extends Component {

    state = {
        data: [],
        disabledCA: true
    }

    select = () => {
        let branchItem = []
        _.mapKeys(_.groupBy(this.props.RELATED_BRANCH_DATA, "RegionID"), (value, key) => {
            branchItem.push({
                RegionID: key,
                BranchItem: _.orderBy(value, ['RegionID', 'AreaID'])
            })
        })

        return (
            <Select
                defaultValue={branchItem[0].BranchItem[0].BranchCode}
                onChange={this.onBranchChange}
                dropdownMatchSelectWidth={false}
                style={{ width: '100%' }}>
                {
                    branchItem.map((item, index) => {
                        return (
                            <OptGroup label={item.RegionID}>
                                {
                                    item.BranchItem.map((branch, i) => {
                                        return <Option value={branch.BranchCode}>{branch.BranchName}</Option>
                                    })
                                }
                            </OptGroup>
                        )

                    })
                }
            </Select>
        )
    }

    selectca = () => {
        let groupItem = []

        _.mapKeys(_.groupBy(this.props.RELATED_EXITING_MARKET_DATA_BACKUP, "OriginBranchCode"), (value, key) => {

            let marketCode = [];
            _.mapKeys(_.groupBy(value, "MarketCode"), (mValue, mKey) => {
                marketCode.push(mKey)
            })

            const caInMarket = _.filter(this.props.RELATED_CA_IN_MARKET_DATA, o => !_.isEmpty(_.find(marketCode, f => f == o.MarketCode)))

            let branch = {}
            if (_.filter(value, { BranchType: 'K' }).length == value.length && _.filter(value, o => o.BranchType != 'K').length <= 0) {
                branch.BranchName = !_.isEmpty(_.find(value, { BranchType: 'K' })) ? _.find(value, { BranchType: 'K' }).BranchName : 'N/A'
            }
            else {
                branch.BranchName = !_.isEmpty(_.find(value, o => o.BranchType != 'K')) ? _.find(value, o => o.BranchType != 'K').BranchName : 'N/A'
            }
            branch.CAItem = []
            _.mapKeys(_.groupBy(caInMarket, "CAHandle"), (caValue, caKey) => {
                branch.CAItem.push({
                    CACode: caKey.split(':')[0],
                    CAName: caKey.split(':')[1],
                })
            })

            groupItem.push(branch)
        })


        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles['ca-icon-list']}>
                {
                    getFieldDecorator('select_ca', {
                        initialValue: this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0]
                    })
                        (
                        <Select
                            disabled={this.state.disabledCA}
                            onChange={this.onCANameChange}
                            dropdownMatchSelectWidth={false}
                            style={{ width: '80%' }}>
                            {
                                groupItem.map((item, index) => {
                                    return (
                                        <OptGroup key={item.BranchName} label={item.BranchName}>
                                            {
                                                item.CAItem.map((ca, i) => {
                                                    return <Option key={ca.CACode} value={ca.CACode}>{ca.CAName}</Option>
                                                })
                                            }
                                        </OptGroup>
                                    )

                                })
                            }
                        </Select>
                        )

                }
                {
                    !this.state.disabledCA &&
                    <div>
                        <Tooltip title="Sale Summary"><FontAwesome name="line-chart" /></Tooltip>
                        <ModalSaleSummary form={this.props.form} />
                        <Tooltip title="Portfolio Quality" placement="topRight"><FontAwesome name="dollar" /></Tooltip>
                    </div>
                }
            </div >
        )
    }

    onBranchChange = (value) => {
        this.setState({ data: this.filterData(value), })
    }

    onCANameChange = (value) => {
        this.setState({ data: this.filterDataByCa(value) })
    }

    columnsSelect = () => {
        const { getFieldDecorator } = this.props.form

        if (this.props.NANO_FILTER_CRITERIA.CAName)
            return [{
                title: (
                    <div className={styles['ca-icon-list']}>
                        {
                            this.props.NANO_FILTER_CRITERIA.CAName.split(',').length > 1 &&
                            getFieldDecorator('checked_all', {
                                valuePropName: 'checked',
                                initialValue: this.props.NANO_FILTER_CRITERIA.CAName.split(',').length > 1
                            })(<Checkbox className={styles['ca-checkbox-all']} onChange={this.checkboxSelectAllCAChange}>All</Checkbox>)
                        }
                        <span>CA Market List</span>
                    </div>
                ),
                className: `${styles['header-select']} ${styles['header-vertical-middle']}`,
                children: null
            }, {
                title: this.selectca(),
                className: styles['header-select'],
                children: null
            }]
        else
            return [{
                title: 'Branch Market List :',
                className: styles['header-select'],
                children: null
            }, {
                title: this.select(),
                className: styles['header-select'],
                children: null
            }]
    }

    columnsBodyLeft = () => [{
        className: styles['align-left'],
        width: '4%',
        className: `${styles['align-right']} ${styles['sm-paddings']}`,
        render: (text, record, index) => (index + 1)
    }, {
        title: (<div className={styles['div-center']}><span>MarketName</span></div>),
        dataIndex: 'MarketName',
        key: 'MarketName',
        width: '25%',
        className: `${styles['align-left']} ${styles['sm-paddings']} ${styles['vertical-middle']}`,
    }]

    columnsBodyRight = () => [{
        title: (<div className={styles['div-center']}><Icon type="environment" style={{ marginBottom: '5px' }} /><span>Km</span></div>),
        dataIndex: 'Radius',
        key: 'Radius',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '5%',
        render: (text, record, index) => (parseFloat(record.Radius).toFixed(parseInt(text) >= 100 ? 0 : 1))
    }, {
        title: (<div className={styles['div-center']}><span>#</span><span>Shop</span></div>),
        dataIndex: 'MarketShop',
        key: 'MarketShop',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '7%',
    }, {
        title: (<div className={styles['div-center']}><span>PMT</span><span>Succ.</span></div>),
        width: '7%',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        render: (text, record, index) => {
            return <span className={text < 0 && styles['red-font']}>{0}%</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>#</span><span>OS</span></div>),
        dataIndex: 'OS',
        className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
        width: '5%',
        render: (text, record, index) => {
            return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}</span>
        }
    }, {
        title: (<div className={styles['div-center']}><span>Market Penetation</span></div>),
        children: [{
            title: (<div className={styles['div-center']}><span>Pot.</span></div>),
            width: '5%',
            dataIndex: 'Potential',
            className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
            render: (text, record, index) => {
                return <span className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
            }
        }, {
            title: (<div className={styles['div-center']}><span>Setup</span></div>),
            className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
            children: [{
                dataIndex: 'SetupTotal',
                className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                width: '5%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}</span>
                }
            }, {
                dataIndex: 'SetupAch',
                className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                width: '5%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px' }} className={text < 0 && styles['red-font']}>{Math.round(parseFloat(text ? text : 0))}%</span>
                }
            }]
        }, {
            title: (<div className={styles['div-center']}><span>Top OS Contribute</span></div>),
            className: `${styles['align-right']} ${styles['sm-paddings']} ${styles['vertical-bottom']}`,
            children: [{
                dataIndex: 'TopContributeName',
                className: `${styles['header-hide']} ${styles['align-left']} ${styles['vertical-bottom']}`,
                width: '10%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px' }}>{text}</span>
                }
            }, {
                dataIndex: 'TopContributeValue',
                className: `${styles['header-hide']} ${styles['align-right']} ${styles['vertical-bottom']}`,
                width: '6%',
                render: (text, record, index) => {
                    return <span style={{ padding: '3px 5px' }} className={text < 0 && styles['red-font']}>{parseFloat(text ? text : 0).toFixed(0)}%</span>
                }
            }]
        }]
    }]

    getTableColumns() {
        if (this.props.RELATED_BRANCH_DATA.length > 0) {
            let columns = this.columnsSelect()
            columns[0].children = this.columnsBodyLeft()
            columns[1].children = this.columnsBodyRight()
            return columns;
        }
        // else {
        //     let columns = []
        //     columns.push(...this.columnsBodyLeft(), ...this.columnsBodyRight())
        //     return columns;
        // }
    }

    filterData(value) {
        return _.orderBy(_.filter(this.props.RELATED_EXITING_MARKET_DATA, { BranchCode: value }), ['Radius'], ['asc'])
    }

    filterDataByCa(value) {
        const marketCACode = _.map(_.filter(this.props.RELATED_CA_IN_MARKET_DATA, { CA_Code: value }), item => item.MarketCode)

        let filter
        if (value) {
            filter = _.filter(this.props.RELATED_EXITING_MARKET_DATA_BACKUP, o => !_.isEmpty(_.find(marketCACode, f => o.MarketCode == f)))
        }
        else {
            filter = this.props.RELATED_EXITING_MARKET_DATA_BACKUP
        }

        this.props.selectMarkerByCA(filter, value)

        return _.orderBy(filter, ['Radius'], ['asc'])
    }

    checkboxSelectAllCAChange = (e) => {
        const { setFieldsValue } = this.props.form

        if (e.target.checked) {
            this.setState({ data: this.filterDataByCa(null), disabledCA: true })
        }
        else {
            setFieldsValue({ select_ca: this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0] })
            this.setState({
                data: this.filterDataByCa(this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0]),
                disabledCA: false
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextState.isRowClick
    }

    componentWillMount() {
        const { RELATED_BRANCH_DATA, RELATED_EXITING_MARKET_DATA } = this.props
        if (RELATED_BRANCH_DATA.length > 0)
            if (this.props.NANO_FILTER_CRITERIA.CAName) {
                if (this.props.NANO_FILTER_CRITERIA.CAName.split(',').length > 1)
                    this.setState({ data: this.filterDataByCa(null), disabledCA: true })
                else
                    this.setState({ data: this.filterDataByCa(this.props.NANO_FILTER_CRITERIA.CAName.split(',')[0]), disabledCA: false })
            }
            else {
                this.setState({ data: this.filterData(RELATED_BRANCH_DATA[0].BranchCode) })
            }
    }

    onRowClick = (record, index, event) => {
        const { setOpenExitingMarketMarker, RELATED_EXITING_MARKET_DATA } = this.props

        setOpenExitingMarketMarker(record, RELATED_EXITING_MARKET_DATA, !_.find(RELATED_EXITING_MARKET_DATA, { MarketCode: record.MarketCode }).showInfo)
    }

    render() {
        return (
            <Table
                style={{ marginBottom: '20px' }}
                className={styles['summary-table']}
                dataSource={this.state.data}
                columns={this.getTableColumns()}
                pagination={false}
                bordered
                onRowClick={this.onRowClick}
            />
        )
    }
}

const SummaryTableForm = Form.create()(SummaryTable)

export default connect(
    (state) => ({
        NANO_FILTER_CRITERIA: state.NANO_FILTER_CRITERIA,
        RELATED_BRANCH_DATA: state.RELATED_BRANCH_DATA,
        RELATED_EXITING_MARKET_DATA: state.RELATED_EXITING_MARKET_DATA,
        RELATED_EXITING_MARKET_DATA_BACKUP: state.RELATED_EXITING_MARKET_DATA_BACKUP,
        RELATED_CA_IN_MARKET_DATA: state.RELATED_CA_IN_MARKET_DATA
    }), {
        setOpenExitingMarketMarker: setOpenExitingMarketMarker,
        selectMarkerByCA: selectMarkerByCA
    })(SummaryTableForm)