import React from 'react'
import Select from "react-select";
import '../../../App.css'

const Selector = (props)=> {
    const { options } = props;
    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          height: 35,
          minHeight: 35,
          border:`1px solid #aaa`,
          borderRadius: 5,
          cursor: "pointer",
          boxShadow: 'none',
        }),
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected ? "white" : "black",
          fontWeight: state.isSelected && "bold",
          padding: 10,
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
      };
    return(
        <>
            <Select
                styles={customStyles}
                theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    // primary: '#1ab394',
                    // zIndex:999
                },
                })}
                className="w-100"
                classNamePrefix="react-select"
                options={options}
                // value={}
                onChange={(e) => console.log('e', e)}
                isClearable={true}
            />
      </>
    )
}

export default Selector;