import React, { PropTypes } from 'react'
import classname from 'classname'

const ScopeInformation = props => {
  let DeleteButton = classname({
      'delete': true,
      'button': true,
      'invisible': props.deleteScope === false
    })
  return (
    <div className="column">
      <div className="card no-padding margin-top-2">
        <div className="card-header">
          <h2>Scope Information</h2>
          <div className="btn-wrap">
            <a className="button outline primary" onClick={props.addScope}><span className="bold"><img role='presentation' src={require('../../Assets/plus.svg')}/></span> Add New</a>
            <a className="button outline primary margin-right" onClick={props.toggleDeleteButton}>{props.editText}</a>
          </div>
        </div>
        <div className="bordered-table">
          <table>
            <thead>
              <tr className="header">
                <td>Model</td>
                <td>Serial Number</td>
                <td>Start Time</td>
                <td>Stop Time 1</td>
                <td>Stop Time 2</td>
                <td>Duration (min)</td>
              </tr>
            </thead>
          </table>
          <table>
            <tbody>
            {
              props.scopes.map((scope, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <img className={DeleteButton} role='presentation' onClick={() => props.deleteScope(i)} src={require('../../Assets/minus.svg')}/>
                      <input value={scope['Scope_Model']} onChange={props.updateScope.bind(props, i, 'Scope_Model')}/>
                    </td>
                    <td><input value={scope['Scope_SerialNumber']} onChange={() => props.updateScope(i, 'Scope_SerialNumber')}/></td>
                    <td><input value={scope['Scope_StartTime']} onChange={() => props.updateScope(i, 'Scope_StartTime')}/></td>
                    <td><input value={scope['Scope_StopTime1']} onChange={() => props.updateScope(i, 'Scope_StopTime1')}/></td>
                    <td><input value={scope['Scope_StopTime2']} onChange={() => props.updateScope(i, 'Scope_StopTime2')}/></td>
                    <td><input value={scope['Scope_Duration']} onChange={() => props.updateScope(i, 'Scope_Duration')}/></td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

ScopeInformation.propTypes = {
  updateScope: PropTypes.func,
  addScope: PropTypes.func,
  editText: PropTypes.string,
  toggleDeleteButton: PropTypes.func,
  deleteScope: PropTypes.boolean,
  scopes: PropTypes.array
}
export default ScopeInformation