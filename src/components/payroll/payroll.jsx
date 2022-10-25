import React, { Component, ReactNode } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StepLabel from '@mui/material/StepLabel';
import 'react-toastify/dist/ReactToastify.min.css';
import { CircleLoader } from 'react-spinners';

export default class PayRoll
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            completed: 0,
            steps: [
                'Accesst Lost',
                'Late Check In',
                'Leave Without Pay',
                'SSC',
                'Income Tax',
                'Mainteanance',
                'Back Pay',
                'Staff Loan',
                'Salary Advance',
                'Petrol',
                'Benefit'
            ]
        }
    }

    componentDidMount() {
        this.handleReset()
    }

    handleNext = () => {
        this.setState({ activeStep: this.state.activeStep + 1 });
    };

    handleBack = () => {
        this.setState({ activeStep: this.state.activeStep - 1 });
    };

    handleReset = () => {
        this.setState({ activeStep: 0 });
    };

    handleStep = () => {
        this.setState({ activeStep: 0 })
    }

    allStepsCompleted = () => {
        this.setState({ activeStep: 0 })
    }

    handleComplete = () => {
        this.setState({ activeStep: 0 })
    }

    CompletedSteps = () => {
        this.setState({ activeStep: 0 })
    }

    totalSteps = () => {
        this.setState({ activeStep: 0 })
    }




    render() {
        const steps = this.state.steps
        const activeStep = this.state.activeStep
        const completed = this.state.completed
        return (
            <div>
                <Box>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', minHeight: '20%' }} >
                        {steps.map((label, index) => (
                            <Step key={label} style={{ width: 300, height: 300 }}>
                                <StepLabel >{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <div className='col-md-12 col-lg-12' style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                        <button className="btn btn-primary"
                            style={{ width: '100px', margin: 5 }}
                            id="saving_button"
                            type="button"
                            onClick={this.handleNext}>
                            {'Next'}
                        </button>
                        <button className="btn btn-primary"
                            style={{ width: '100px', margin: 5 }}
                            id="saving_button"
                            type="button"
                            onClick={this.handleBack} >
                            Back
                        </button>

                    </div>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>All steps completed - you&apos;re finished</Typography>
                            <Button onClick={this.handleReset} sx={{ mt: 1, mr: 1 }}>
                                Reset
                            </Button>
                        </Paper>
                    )}

                </Box>
            </div >
        )
    }
}

{/* <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box> */}