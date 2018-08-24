<<<<<<< HEAD
import React, {ReactDOM, Component} from 'react'
import {render} from 'react-dom'
import {
    LocaleProvider,
    DatePicker,
    Table,
    Spin,
    Icon,
    Form,
    Row,
    Col,
    Input,
    Select,
    Radio,
    Checkbox,
    Button,
    notification
} from 'antd'
=======
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { Table, Icon, Badge, Form, Row, Col, Collapse, Input, TreeSelect, Select, DatePicker, Radio, Checkbox, Modal, Button } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
>>>>>>> 494dd7a76674c67975318d3f3f58f3a486c073a2
import QueueAnim from 'rc-queue-anim'
import bluebird from 'bluebird'
import _ from 'lodash'

<<<<<<< HEAD
import CategoryTreeView from './CategoryFile'
=======
import CategoryTreeView from './TreeView'
import FileUploadManager from './uploader'
import ChatComponent from './chatbox'
>>>>>>> 494dd7a76674c67975318d3f3f58f3a486c073a2

import { 
    getDocumentScanDashboard,
    getMissingDocumentList,
    getMasterReturnCode

} from '../../actions/master'

<<<<<<< HEAD
export const columns = [
    {
        title: 'Scan Start',
        dataIndex: 'CreateScanDate',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="laptop"/>),
                dataIndex: 'Monitor',
                className: 'ttu'
            }, {
                title: 'DATE',
                dataIndex: 'ScanDate',
                className: 'ttu'
            }, {
                title: (<Icon type="dashboard"/>),
                dataIndex: 'ScanTiming',
                className: 'ttu',
                render: (str_per) => {
                    return (str_per)
                        ? `${roundFixed(str_per, 0)}%`
                        : `0%`
                }
            }
        ]
    }, {
        title: 'Progress Information',
        dataIndex: 'ProgressInfo',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="upload"/>),
                dataIndex: 'FileUpload',
                className: 'ttu'
            }, {
                title: (<i className="fa fa-circle"/>),
                dataIndex: 'ProgressColor',
                className: 'ttu'
            }, {
                title: 'Action',
                dataIndex: 'Action',
                className: 'ttu'
            }
        ]
    }, {
        title: 'Appraisal Information',
        dataIndex: 'AppraisalInfo',
        className: `ttu`,
        children: [
            {
                title: 'Date',
                dataIndex: 'AppraisalDate',
                className: 'ttu'
            }, {
                title: (<i className="fa fa-circle"/>),
                dataIndex: 'AppraisalProgressColor',
                className: 'ttu'
            }, {
                title: 'Received',
                dataIndex: 'ReceivedDate',
                className: 'ttu'
            }, {
                title: 'Name',
                dataIndex: 'ReceivedName',
                className: 'ttu'
            }
        ]
    }, {
        title: 'Customer Information',
        dataIndex: 'CustomerInfo',
        className: `ttu`,
        children: [
            {
                title: (<i className="icon-copy"/>),
                dataIndex: 'MissingDoc',
                className: 'ttu'
            }, {
                title: 'App No',
                dataIndex: 'ApplicationNo',
                className: 'ttu'
            }, {
                title: (<i className="fa fa-users"/>),
                dataIndex: 'BorrowerAmount',
                className: 'ttu'
            }
        ]
    }, {
        title: 'Branch Information',
        dataIndex: 'BranchInfo',
        className: `ttu`,
        children: [
            {
                title: 'Branch',
                dataIndex: 'BranchName',
                className: 'ttu'
            }, {
                title: 'Name',
                dataIndex: 'EmployeeName',
                className: 'ttu'
            }
        ]
    }, {
        title: 'ST',
        dataIndex: 'Status',
        className: `ttu`,
        width: w50
    }, {
        title: (<i className="icon-new-tab"/>),
        dataIndex: 'link',
        className: `ttu`
    }
]
=======
import { config } from './config'
import { documentscan_columns, missing_columns } from './config/columns'
import cls from './style/index.scss'

const Option = Select.Option
const FormItem = Form.Item
const ButtonGroup = Button.Group
const Panel = Collapse.Panel

class GridDocument extends Component {

    constructor(props) {
        super(props)

        this.state = {
            filter: {
                AuthID: '57251',
                RegionID: null,
                AreaID: null,
                BranchCode: null,
                EmployeeCode: null,
                DateType: 'ScanDate',
                DatePeriod: [],
                ReferenceType: 'Application No',
                ReferenceNo: null,
                BorrowerName: null
            },
            modal: {
                missing: false,
                upload: false,
                chatbox: false
            },
            data: {
                customer_info: [],
                upload_info: []
            },
            pagination: {
                size: 'small',
                pageSize: 20,
                showQuickJumper: false,
                pageInfo: null,
                showTotal: (total, range) => {
                    const { pagination } = this.state

                    let el_target = document.querySelector('.number_length')
                    if (el_target) {
                        pagination.pageInfo = `Showing ${range[0]} to ${range[1]} of ${total} entries`
                        if (el_target.innerHTML.length > 0) {
                            el_target.innerHTML = el_target.innerHTML.replace(el_target.innerHTML, pagination.pageInfo)
                        } else {
                            el_target.innerHTML = pagination.pageInfo
                        }
                        return pagination.pageInfo
                    }
                }
            }
        }

    }

    componentWillMount() {
        const { GET_DOCUMENT_DASHBOARD, GET_MASTER_RETURNCODE } = this.props       
        bluebird.all([GET_MASTER_RETURNCODE(), GET_DOCUMENT_DASHBOARD(this.state.filter)])
    }

    componentWillReceiveProps(props) {
        if(props) {
            const { gridData } = props
            if(gridData) {
                _.map(gridData, (v) => {
                    v.Monitor = (<Icon type="laptop" className={`pointer`} onClick={this.handleOpenChatbox.bind(this, v)} />)
                    v.MissingDoc = (v.MissingDoc_Amount && v.MissingDoc_Amount > 0) ?
                        (<Badge count={v.MissingDoc_Amount} className={`${cls['removeBoxShadow']} pointer`} onClick={this.handleOpenMissing.bind(this, v.DocID)}><Icon type="copy" className="pointer" style={{ fontSize: '14px' }} /></Badge>) : 
                        (<Icon type="copy" className="pointer" onClick={this.handleOpenMissing.bind(this, v.DocID)} style={{ fontSize: '14px' }} />)

                    v.CA_UploadItem = (<Icon type="upload" className={`pointer`} onClick={this.handleOpenUpload.bind(this, [v.ApplicationNo, 'CA'])} />)
                    v.AP_UploadItem = (<Icon type="upload" className={`pointer`} onClick={this.handleOpenUpload.bind(this, [v.ApplicationNo, 'AP'])} />)
                    v.OP_UploadItem = (<Icon type="upload" className={`pointer`} onClick={this.handleOpenUpload.bind(this, [v.ApplicationNo, 'OP'])} />)

                })

            }
        }
    }
>>>>>>> 494dd7a76674c67975318d3f3f58f3a486c073a2

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

    handleSearchSubmit = () => {
        
    }

    handlePageChange = (size) => {
        this.setState({ pagination: _.assignIn({}, this.state.pagination, { pageSize: parseInt(size) }) })
    }

    handleOpenMissing = (doc_id) => {
        const { GET_MISSINGDOC_LIST } = this.props
        if(doc_id && !_.isEmpty(doc_id)) {
            GET_MISSINGDOC_LIST({ DocID: doc_id })
            this.setState({ modal: _.assign({}, this.state.modal, { missing: true }) })
        }
    }

    handleCloseMissing = () => {
        this.setState({ modal: _.assign({}, this.state.modal, { missing: false }) })
    }

    handleOpenUpload = (data) => {  
        if(!_.isEmpty(data)) {
            this.setState({ 
                modal: _.assign({}, this.state.modal, { upload: true }),
                data: _.assign({}, this.state.data, { upload_info: data })
            })
        }        
    }

    handleCloseUpload = () => {
        this.setState({ 
            modal: _.assign({}, this.state.modal, { upload: false }),
            data: _.assign({}, this.state.data, { upload_info: [] })
        })
    }

    handleOpenChatbox = (data) => {
        this.setState({ 
            modal: _.assign({}, this.state.modal, { chatbox: true }),
            data: _.assign({}, this.state.data, { customer_info: data })
        })
    }

    handleCloseChatbox = () => {
        this.setState({ 
            modal: _.assign({}, this.state.modal, { chatbox: false }),
            data: _.assign({}, this.state.data, { customer_info: [] })
        })
    }
    
    render() {
        const { gridData, missingData, returnCode } = this.props
        const { data, modal, pagination } = this.state

        return (
<<<<<<< HEAD
            <div
                style={{
                position: 'relative',
                minHeight: 'calc(100% - 16px)'
            }}>
                <CategoryTreeView/> {/* <QueueAnim type="bottom" duration={800}>
                    <div key="1" className={`${cls['grid_container']}`}>
                        <h3 className={cls['grid_title']}>SCAN MONITOR DASHBOARD</h3>
                        <Table
                            className={cls['grid_table']}
=======
            <div style={{ position: 'relative', minHeight: 'calc(100% - 16px)' }}>
                <Scrollbar>
                    {/*<CategoryTreeView />*/}
                    <QueueAnim type="bottom" duration={800}>
                        <div key="1" className={`${cls['grid_container']}`}>
                            <h3 className={cls['grid_title']}>DOCUMENT MONITOR DASHBOARD</h3>
                            { this.handleHeadFilter() }
                            <Table                            
                                rowKey={this.handleRowKey}
                                className={cls['grid_table']}
                                columns={documentscan_columns}
                                dataSource={gridData}
                                loading={(gridData && gridData.length > 0) ? false : true }
                                pagination={pagination}
                                footer={this.handleFooter}
                                size="small"
                                bordered
                            />
                        </div>                    
                    </QueueAnim>
                </Scrollbar>

                <FileUploadManager 
                    modal={modal}
                    data={data.upload_info}
                    handleClose={this.handleCloseUpload}
                />

                <ChatComponent
                    modal={modal}
                    data={data.customer_info}
                    returnCode={returnCode.Data}
                    handleClose={this.handleCloseChatbox}
                />

                <MissingDoc 
                    modal={modal}
                    dataSource={missingData}
                    handleClose={this.handleCloseMissing}
                />

            </div>

        )
    }

    //SET HEAD PANEL
    handleHeadFilter = () => {     
        const { filter, pagination } = this.state
        const { form } = this.props
        const { getFieldDecorator } = form
        const { RangePicker } = DatePicker

        const gutter_init = 10
        const field_colon_label = false
        const tree_config = {
            size: 'large',
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_PARENT,
            dropdownMatchSelectWidth: false,
            style: { width: '100%' }
        }

        const prefixSelectorIdentity = getFieldDecorator('ReferenceType', { initialValue: 'ApplicationNo' })(
            <Select style={{ width: 80 }} onChange={this.onChangeApplicationType}>
                <Option value="Application No" title="Application No">APP</Option>
                <Option value="Citizen ID" title="ID Card">ID</Option>
            </Select>
        )

        return (
            <div className={`${cls['search_collapse_conainer']}`}>
                <div style={{ position: 'relative' }}>
                    <div className={cls['page_container']}>
                        <label>
                            Show
                            <Select className={cls['page_sizenumber']} defaultValue={`${pagination.pageSize}`} size="small" onChange={this.handlePageChange}>
                                { _.map(config.pageSize, (v, i) => { return (<Option key={(i + 1)} value={`${v}`}>{`${v}`}</Option>) }) }
                            </Select>
                            entries
                        </label>
                        <div className="number_length"></div>
                    </div>
                </div>
                <div>
                    <Collapse className={`${cls['collapse_filter']}`}>
                        <Panel header={<header><Icon type="search" /> FILTER CRITERIA</header>}>
                            <Form onSubmit={this.handleSearchSubmit}>
                                <Row gutter={gutter_init}>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                </Row>
                                <Row gutter={gutter_init}>
                                    <Col span={6}>
                                        <FormItem label="Region" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Region', { initialValue: [] })
                                                (
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandAll={true}
                                                        size="default"
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Area" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Area', { initialValue: [] })
                                                (
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandedKeys={[`all`]}
                                                        size="default"
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Branch" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Branch', { initialValue: [] })
                                                (
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandedKeys={[`all`]}
                                                        dropdownStyle={{ height: '400px' }}
                                                        size="default"                                                        
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Employee" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('Employee', { initialValue: [] })
                                                (
                                                    <TreeSelect
                                                        {...tree_config}
                                                        treeData={[]}
                                                        treeDefaultExpandedKeys={[`all`]}
                                                        dropdownMatchSelectWidth={true}
                                                        dropdownStyle={{ height: '400px' }}
                                                        size="default"
                                                        className={`${cls['padding_none']}`}
                                                        disabled={false}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row gutter={gutter_init}>
                                    <Col span={6}>
                                        <FormItem label="Date Type" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('DateType', { initialValue: 'CreateDate' })
                                                (
                                                    <Select>
                                                        <Option value="CreateDate">Scan Start</Option>
                                                        <Option value="ProgressDate">Latest Progress</Option>
                                                        <Option value="AppraisalStart">Appraisal Start</Option>
                                                        <Option value="AppraisalReceived">Appraisal Received</Option>
                                                        <Option value="CAReturnDate">CA Return</Option>
                                                        <Option value="CAReceivedDate">A2CA Date</Option>                                                        
                                                        <Option value="StatusDate">Status Date</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>                                       
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Date Period" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                           {
                                                getFieldDecorator('DateRange', { initialValue: [] })
                                                (
                                                    <RangePicker
                                                        format="DD/MM/YYYY"
                                                        treeNodeLabelProp="label"
                                                        placeholder={['START', 'END']}                                                   
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label={filter.ReferenceType} className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('ReferenceNo', {})(<Input addonBefore={prefixSelectorIdentity} style={{ width: '100%' }} />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="Borrower Name" className={`${cls['form_item']} ttu fw5`} colon={field_colon_label}>
                                            {
                                                getFieldDecorator('BorrowerName', {})(<Input  />)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={gutter_init}>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={12}>        
                                        <FormItem className={`fr`}>
                                            <ButtonGroup>
                                                <Button type="dashed" className={`ttu`} onClick={this.handleReset}>Clear</Button>
                                                <Button type="primary" className={`ttu`} htmlType="submit" style={{ backgroundColor: '#0e77ca' }}>
                                                    <Icon type="search" />Submit
                                                </Button>
                                            </ButtonGroup>
                                        </FormItem>                          
                                    </Col>
                                </Row>
                            </Form>
                        </Panel>      
                    </Collapse>
                </div>                
            </div>            
        )

    }

    handleFooter = (currentPageData) => {}
    
    onChangeApplicationType = (data) => {
        this.setState({ filter: _.assign({}, this.state.filter, { ReferenceType: data }) })
    }
    
}

class MissingDoc extends Component {

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.modal.missing !== nextProps.modal.missing ||
               this.props.dataSource !== nextProps.dataSource
    }

    render() {
        const { modal, dataSource, handleClose } = this.props

        return (
            <Modal
                visible={modal.missing}
                title={<span className="ttu">Missing Document Information</span>}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="65%"
            >
                <QueueAnim type="scale" duration={800}>
                    <div key="2" className={`${cls['grid_container']}`}>    
                        <Table                            
>>>>>>> 494dd7a76674c67975318d3f3f58f3a486c073a2
                            rowKey={this.handleRowKey}
                            className={cls['grid_table']}
                            columns={missing_columns}
                            dataSource={dataSource.Data}
                            loading={(dataSource.Status) ? false : true}
                            pagination={{}}
                            size="small"
                            bordered/>
                    </div>
<<<<<<< HEAD
                </QueueAnim> */}
            </div>

=======
                </QueueAnim>
            </Modal>
>>>>>>> 494dd7a76674c67975318d3f3f58f3a486c073a2
        )
        
    }

<<<<<<< HEAD
    handleRowKey = (records, i) => {
        return (records && records.RowID)
            ? `${records.RowID}_${ (i + 1)}`
            : 0
    }

    handleFooter = (currentPageData) => {}

}

export default GridDocument
=======
}

const GridDocumentDashboardWithCookies = withCookies(GridDocument)
const GridDocumentManagement = Form.create()(GridDocumentDashboardWithCookies)
export default connect(
    (state) => ({
       gridData: state.DOCUMENTSCAN_DASHBOARD.Data,
       missingData: state.DOCUMENTSCAN_MISSINGDOC,
       returnCode: state.DOCUMENTSCAN_RETURNCODE
    }), 
    {
        GET_DOCUMENT_DASHBOARD: getDocumentScanDashboard,
        GET_MISSINGDOC_LIST: getMissingDocumentList,
        GET_MASTER_RETURNCODE: getMasterReturnCode
    }
)(GridDocumentManagement)

>>>>>>> 494dd7a76674c67975318d3f3f58f3a486c073a2
