import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Menu from '../../components/uielements/menu';
import IntlMessages from '../../components/utility/intlMessages';
import getDevSidebar from '../../customApp/sidebar';
import SidebarWrapper from './sidebar.style';

import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';
import { rtl } from '../../config/withDirection';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed
} = appActions;
const stripTrailingSlash = str => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }
  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }
  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2']
    };
    return map[key] || [];
  };

  renderView({ style, ...props }) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0'
    };
    return (
      <div className="box" style={{ ...style, ...viewStyle }} {...props} />
    );
  }

  render() {
    // const { url, app, toggleOpenDrawer, bgcolor } = this.props;
    const { app, toggleOpenDrawer, customizedTheme } = this.props;
    const url = stripTrailingSlash(this.props.url);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor
    };
    const submenuStyle = {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: customizedTheme.textColor
    };
    const submenuColor = {
      color: customizedTheme.textColor
    };
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed} />
          <Scrollbars
            renderView={this.renderView}
            style={{ height: scrollheight - 70 }}
          >
            <Menu
              onClick={this.handleClick}
              theme="dark"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"
            >
              <Menu.Item key="mailbox">
                <Link to={`${url}/mailbox`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-mail" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.email" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="ecommerce"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-bag" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.ecommerce" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="shop">
                  <Link style={submenuColor} to={`${url}/shop`}>
                    <IntlMessages id="sidebar.shop" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="cart">
                  <Link style={submenuColor} to={`${url}/cart`}>
                    <IntlMessages id="sidebar.cart" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="checkout">
                  <Link style={submenuColor} to={`${url}/checkout`}>
                    <IntlMessages id="sidebar.checkout" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="card">
                  <Link style={submenuColor} to={`${url}/card`}>
                    <IntlMessages id="sidebar.cards" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu
                key="map"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-map" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.maps" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="googlemap">
                  <Link style={submenuColor} to={`${url}/googlemap`}>
                    <IntlMessages id="sidebar.googleMap" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="leafletmap">
                  <Link style={submenuColor} to={`${url}/leafletmap`}>
                    <IntlMessages id="sidebar.leafletMap" />
                  </Link>
                </Menu.Item>
              </SubMenu>

              <Menu.Item key="youtubeSearch">
                <Link to={`${url}/youtubeSearch`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-social-youtube" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.youtubeSearch" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="calendar">
                <Link to={`${url}/calendar`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-calendar" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.calendar" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="notes">
                <Link to={`${url}/notes`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-clipboard" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.notes" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="todo">
                <Link to={`${url}/todo`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-list" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.todos" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="contacts">
                <Link to={`${url}/contacts`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-person-add" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.contacts" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="shuffle">
                <Link to={`${url}/shuffle`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-grid" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.shuffle" />
                    </span>
                  </span>
                </Link>
              </Menu.Item>

              <SubMenu
                key="charts"
                title={
                  <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-arrow-graph-up-right" />
                    <span className="nav-text">
                      <IntlMessages id="sidebar.charts" />
                    </span>
                  </span>
                }
              >
                <Menu.Item style={submenuStyle} key="googleChart">
                  <Link style={submenuColor} to={`${url}/googleChart`}>
                    <IntlMessages id="sidebar.googleCharts" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reecharts">
                  <Link style={submenuColor} to={`${url}/reecharts`}>
                    <IntlMessages id="sidebar.recharts" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reactVis">
                  <Link style={submenuColor} to={`${url}/reactVis`}>
                    <IntlMessages id="sidebar.reactVis" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reactChart2">
                  <Link style={submenuColor} to={`${url}/reactChart2`}>
                    <IntlMessages id="sidebar.reactChart2" />
                  </Link>
                </Menu.Item>
                <Menu.Item style={submenuStyle} key="reactTrend">
                  <Link style={submenuColor} to={`${url}/reactTrend`}>
                    <IntlMessages id="sidebar.reactTrend" />
                  </Link>
                </Menu.Item>

                <Menu.Item style={submenuStyle} key="frappeChart">
                  <Link style={submenuColor} to={`${url}/frappeChart`}>
                    <IntlMessages id="sidebar.frappeChart" />
                  </Link>
                </Menu.Item>
                {/*<Menu.Item style={submenuStyle} key="echart">
                  <Link style={submenuColor} to={`${url}/echart`}>
                    <IntlMessages id="sidebar.eChart" />
                  </Link>
                </Menu.Item>*/}
              </SubMenu>



              {/* <Menu.Item key="grid_layout">
              <Link to={`${url}/gridLayout`}>
                <span className="isoMenuHolder" style={submenuColor}>
                  <i className="ion-cube" />
                  <span className="nav-text">
                    <IntlMessages id="sidebar.boxOptions" />
                  </span>
                </span>
              </Link>
            </Menu.Item> */}


            
              {getDevSidebar(url, submenuColor)}
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    app: state.App.toJS(),
    customizedTheme: state.ThemeSwitcher.toJS().sidebarTheme
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
