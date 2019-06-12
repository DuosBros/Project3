export function workingOnAction() {
    return {
        type: 'WORKING_ON'
    }
}

export function workingOffAction() {
    return {
        type: 'WORKING_OFF'
    }
}

export function requestLogin(creds) {
    return {
      type: 'LOGIN_REQUEST',
      isFetching: true,
      isAuthenticated: false,
      creds
    }
  }
  
  export function receiveLogin(user) {
    return {
      type: 'LOGIN_SUCCESS',
      isFetching: false,
      isAuthenticated: true,
      id_token: user.id_token
    }
  }
  
  export function loginError(message) {
    return {
      type: 'LOGIN_FAILURE',
      isFetching: false,
      isAuthenticated: false,
      message
    }
  }

  export function logoutUser() {
    return dispatch => {
      dispatch(requestLogout())
      localStorage.removeItem('id_token')
      localStorage.removeItem('access_token')
      dispatch(receiveLogout())
    }
  }
  
export function removeFromDeletedAction(payload) {
    return {
        type: 'REMOVE_DELETED_PATIENT',
        payload
    }
}
export function getAllDeletedPatientsAction(payload) {
    return {
        type: 'FETCH_DELETED_PATIENTS',
        payload
    }
}

export function toggleCurrentCheckBoxAction() {
    return {
        type: 'TOGGLE_CURRENT_CHECKBOX'
    }
}

export function togglePastCheckBoxAction() {
    return {
        type: 'TOGGLE_PAST_CHECKBOX'
    }
}

export function removePatientFromTag(payload) {
    return {
        type: 'REMOVE_PATIENT_FROM_TAG',
        payload
    }
}

export function logoutAction() {
    return {
        type: 'NO_AUTH'
    }
}

export function authAction() {
    return {
        type: 'AUTH'
    }
}

export function getTagEventTypesAction(payload) {
    return {
        type: 'FETCH_TAGEVETTYPES',
        payload
    }
}

export function selectTagEventToModifyAction(payload) {
    return {
        type: 'TOGGLE_MODIFYTAGEVENTMODAL',
        payload
    }
}



export function showDeletedPatientsAction() {
    return {
        type: 'SHOW_DELETEDPATIENTS'
    }
}

export function assignTagAction(payload) {
    return {
        type: 'ASSIGN_TAG',
        payload
    }
}

export function saveObjectForTagInfoModalAction(payload) {
    return {
        type: 'SAVE_OBJECT_TAGINFO',
        payload
    }
}


export function toggleWorkingAction(payload) {
    return {
        type: 'TOGGLE_WORKING',
        payload
    }
}

export function deleteTagEventsAction(payload) {
    return {
        type: 'REFRESH_TAGEVENTS',
        payload
    }
}

export function editTagEventAction(payload) {
    return {
        type: 'MODIFY_TAGEVENT',
        payload
    }
}

export function mapPatientToTagEventsAction(tagEvents, patient) {
    return {
        type: 'MAP_PATIENTTOTAGEVENTS',
        tagEvents,
        patient
    }
}

export function savePatientTagEventsAction(payload) {
    return {
        type: 'FETCH_PATIENTTAGEVENTS',
        payload
    }
}

export function saveTagEventsAction(payload) {
    return {
        type: 'FETCH_TAGEVENTS',
        payload
    }
}

export function selectTagEventAction(payload) {
    return {
        type: 'SELECT_TAGEVENT',
        payload
    }
}

export function removeNotification(payload) {
    return {
        type: 'REMOVE_NOTIFICATION',
        payload
    }
}

export function triggerNotification(payload) {
    return {
        type: 'TRIGGER_NOTIFICATION',
        payload
    }
} 

export function closeTagInfoAction() {
    return {
        type: 'CLOSE_TAG_INFO'
    };
}

export function openTagInfoAction(payload) {
    return {
        type: 'OPEN_TAG_INFO',
        payload
    };
}

export function openEditPatientModalAction(payload) {
    return {
        type: 'OPEN_PATIENT_EDIT',
        payload
    };
}

export function editPatientAction(payload) {
    return {
        type: 'EDIT_PATIENT',
        payload
    };
}

export function deletePatientAction(payload) {
    return {
        type: 'REMOVE_PATIENT',
        payload
    };
}

export function removeTagAction(payload) {
    return {
        type: 'REMOVE_TAG',
        payload
    };
}

export function setActiveTagAction(payload) {
    return {
        type: 'SET_ACTIVE_TAG',
        payload
    };
}

export function getAllTagsAction(payload) {
    return {
        type: 'FETCH_TAGS',
        payload
    };
}

export function getAllTagRegistrationsAction(payload) {
    return {
        type: 'GET_TAGREGISTRATIONS',
        payload
    };
}

export function getActivePatientsAction(payload) {
    return {
        type: 'FETCH_ACTIVE_PATIENTS',
        payload
    };
}

export function addPatientAction(payload) {
    return {
        type: 'ADD_PATIENT',
        payload
    }
}

export function addTagAction(payload) {
    return {
        type: 'ADD_SELECTED_TAG',
        payload
    }
}

export function selectTagAction(payload) {
    return {
        type: 'TOGGLE_SELECTED_TAG',
        payload
    }
}

export function selectPatientAction(payload) {
    return {
        type: 'TOGGLE_SELECTED_PATIENT',
        payload
    }
}

export function unSelectTagAction(payload) {
    return {
        type: 'TOGGLE_OFF_SELECTED_TAG',
        payload
    }
}

export function unSelectPatientAction(payload) {
    return {
        type: 'TOGGLE_OFF_SELECTED_PATIENT',
        payload
    }
}

export function showModal() {
    return {
      type: 'SHOW_MODAL',
    }
  }
   
  export function hideModal() {
    return {
      type: 'HIDE_MODAL'
    }
  }

  