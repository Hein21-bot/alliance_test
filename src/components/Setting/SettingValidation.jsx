

export const AttendancePolicyValidation = (data, workingDays) => {
    const {
        day_open_hour,
        day_close_hour,
        ot_start_time,
        ot_end_time,
        ot_allow_designation,
        ot_allow,
        late_check_in_start,
        late_check_in_allow,
        early_check_out_start,
        early_check_out_allow
    } = data;
    const err = {};
    if (!workingDays) {
        err.workingDaysErr = "Please select working days!"
    }
    if (!day_open_hour) {
        err.officeStErr = "Please select start time!"
    }
    if (!day_close_hour) {
        err.officeEtErr = "Please select end time!"
    }
    if (!ot_start_time) {
        err.otStErr = "Please select start time!"
    }
    if (!ot_end_time) {
        err.otEtErr = "Please select end time!"
    }
    if (!ot_allow_designation || ot_allow_designation.length < 1 || ot_allow_designation[0] === null) {
        err.otAllowDesignationErr = "Please select OT Allow Designation!"
    }
    if (ot_allow === null || ot_allow === undefined) {
        err.otAllowEtErr = "Please select OT Allow!"
    }
    if (!late_check_in_start) {
        err.lateCheckInStErr = "Please select time!"
    }
    if (late_check_in_allow === null || late_check_in_allow === undefined) {
        err.lateCheckInAllowErr = "Please select Late Check In Allow!"
    }
    if (!early_check_out_start) {
        err.earlyCheckOutStStErr = "Please select time!"
    }
    if (early_check_out_allow === null || early_check_out_allow === undefined) {
        err.earlyCheckOutAllowErr = "Please select Early Check Out Allow!"
    }
    return err;
}

export const BenefitValidation = (data) => {
    const {
        benefit_type_id,
        is_married,
        allow_level,
        allow_service_year,
        amount,
        no_of_child
    } = data;
    const err = {};
    if (!benefit_type_id || benefit_type_id === '' || benefit_type_id === -1) {
        err.benefitTypeErr = "Please select Benefit Type!"
    }
    if (!amount || amount === '') {
        err.amountErr = "Please fill amount!"
    }
    if (!allow_level || allow_level === '') {
        err.allowLevelErr = "Please fill allow level!"
    }
    // if(!allow_service_year || allow_service_year===''){
    //     err.allowServiceYrErr = 'Please fill allow service year!'
    // }
    if (benefit_type_id === 6) {
        if (is_married === '' || is_married === -1) {
            err.isMartialErr = 'Please select martial status!'
        }
        if (is_married === 1 && (!no_of_child || no_of_child === '')) {
            err.childCntErr = 'Please fill child count!'
        }
    }

    return err;
}

export const HolidayValidation = (data) => {
    const {
        event_name
    } = data;
    const err = {};
    if (!event_name || event_name === '') {
        err.eventNameErr = 'Please fill event name!'
    }

    return err;
}

export const SalarytemplateValidation = (data) => {
    const {
        basic_salary,
        career_level,
        career_sub_level
    } = data;
    const err = {};
    if (!basic_salary || basic_salary === '') {
        err.basicSalaryErr = 'Please fill basic salary!'
    }
    if (!career_level || career_level === '') {
        err.careerLevelErr = 'Please select career level!'
    }
    if (!career_sub_level || career_sub_level === '') {
        err.careerSubLevelErr = 'Please select career sub level!'
    }

    return err;
}

export const SSBRateValidation = (data) => {
    const {
        percentage,
    } = data;
    const err = {};
    if (!percentage || percentage === '') {
        err.percentErr = 'Please fill percentage!'
    }

    return err;
}

export const CareerPathValidation = (data) => {
    const {
        career_level,
        career_sub_level,
        promotion_quota
    } = data;
    const err = {};
    if (!career_level || career_level === '') {
        err.careerLevelErr = 'Please select career level!'
    }
    if (!career_sub_level || career_sub_level === '') {
        err.careerSubLevelErr = 'Please select career sub level!'
    }
    if (!promotion_quota || promotion_quota === '' || promotion_quota.trim() === '') {
        err.promotionQuotaErr = 'Please fill promotion quota!'
    }

    return err;
}