import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Box, useTheme, alpha, Typography, IconButton, Tooltip } from "@mui/material";
import { Person as PersonIcon, Phone as PhoneIcon, Email as EmailIcon, Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";
import Autocomplete from "@mui/material/Autocomplete";

const PersonalInfoForm = ({ formData, handleChange }) => {
  const personalInfo = formData.personalInformation;
  const [dobError, setDobError] = useState("");
  const [civilScoreText, setCivilScoreText] = useState("");
  const [additionalPhones, setAdditionalPhones] = useState([]);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    phoneNo: "",
    officeNo: "",
    residenceNo: "",
    emailId: ""
  });
  const [phoneTypes, setPhoneTypes] = useState({
    phoneNo: "",
    officeNo: "",
    residenceNo: ""
  });
  const theme = useTheme();

  const handleFieldChange = (field, value) => {
    handleChange("personalInformation", field, value);

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validation functions
  const validatePhoneNumber = (phone) => {
    if (!phone) return { error: "", type: "" }; // Empty is okay

    // Remove any spaces, dashes, or parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Mobile number validation (10 digits, starts with 6-9)
    const mobileRegex = /^[6-9]\d{9}$/;

    // Landline validation (with STD code)
    // Format: 2-4 digit STD code + 6-8 digit number
    const landlineRegex = /^[1-9]\d{1,3}[2-9]\d{6,7}$/;

    // Landline validation (without STD code) - 6-8 digits starting with 2-9
    const landlineWithoutStdRegex = /^[2-9]\d{5,7}$/;

    if (mobileRegex.test(cleanPhone)) {
      return { error: "", type: "mobile" };
    } else if (landlineRegex.test(cleanPhone)) {
      return { error: "", type: "landline" };
    } else if (landlineWithoutStdRegex.test(cleanPhone)) {
      return { error: "", type: "landline" };
    } else {
      return {
        error: "Please enter a valid 10-digit mobile number or landline number",
        type: ""
      };
    }
  };

  const validateEmail = (email) => {
    if (!email) return ""; // Empty is okay

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Validation handlers
  const handlePhoneValidation = (field, value) => {
    const result = validatePhoneNumber(value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: result.error
    }));
    setPhoneTypes(prev => ({
      ...prev,
      [field]: result.type
    }));
  };

  const handleEmailValidation = (field, value) => {
    const error = validateEmail(value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Helper function to trigger call
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  // Helper function to trigger email
  const handleEmail = (emailAddress) => {
    if (emailAddress) {
      window.location.href = `mailto:${emailAddress}`;
    }
  };

  // Add additional phone number
  const addAdditionalPhone = () => {
    const newPhone = {
      id: Date.now(),
      number: "",
      type: ""
    };
    setAdditionalPhones([...additionalPhones, newPhone]);
  };

  // Remove additional phone number
  const removeAdditionalPhone = (id) => {
    setAdditionalPhones(additionalPhones.filter(phone => phone.id !== id));
  };

  // Add additional email
  const addAdditionalEmail = () => {
    const newEmail = {
      id: Date.now(),
      address: ""
    };
    setAdditionalEmails([...additionalEmails, newEmail]);
  };

  // Remove additional email
  const removeAdditionalEmail = (id) => {
    setAdditionalEmails(additionalEmails.filter(email => email.id !== id));
  };

  // Update additional email
  const updateAdditionalEmail = (id, address) => {
    setAdditionalEmails(additionalEmails.map(email =>
      email.id === id
        ? { ...email, address }
        : email
    ));
  };

  // Reusable Phone Field with Button
  const PhoneFieldWithButton = ({ label, fieldName, value, phoneType }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      <Box sx={{ flex: 1 }}>
        <StyledTextField
          label={label}
          name={fieldName}
          value={formatPhoneNumber(value || "", phoneType)}
          onChange={(e) => handlePhoneInputChange(fieldName, e.target.value)}
          onBlur={(e) => handlePhoneValidation(fieldName, e.target.value)}
          error={!!validationErrors[fieldName]}
          helperText={
            validationErrors[fieldName] ||
            (phoneType === "mobile" ? "Mobile" :
              phoneType === "landline" ? "Landline" : "")
          }
          inputProps={{
            maxLength: 14,
          }}
          sx={textFieldStyles}
        />
      </Box>
      <Tooltip title={value ? "Call" : "Enter phone number"}>
        <span>
          <IconButton
            onClick={() => handleCall(value)}
            disabled={!value}
            sx={{
              color: value ? 'success.main' : 'action.disabled',
              mb: '8px'
            }}
          >
            <PhoneIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );

  // Reusable Email Field with Button
  const EmailFieldWithButton = ({ label, fieldName, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      <Box sx={{ flex: 1 }}>
        <StyledTextField
          label={label}
          name={fieldName}
          type="email"
          value={value || ""}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          onBlur={(e) => handleEmailValidation(fieldName, e.target.value)}
          error={!!validationErrors[fieldName]}
          helperText={validationErrors[fieldName]}
          sx={textFieldStyles}
        />
      </Box>
      <Tooltip title={value ? "Send Email" : "Enter email address"}>
        <span>
          <IconButton
            onClick={() => handleEmail(value)}
            disabled={!value}
            sx={{
              color: value ? 'primary.main' : 'action.disabled',
              mb: '8px'
            }}
          >
            <EmailIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );

  // Format phone number display based on type
  const formatPhoneNumber = (value, type) => {
    if (!value || !type) return value;

    const cleanValue = value.replace(/[\s\-\(\)]/g, '');

    if (type === "mobile") {
      // Format as XXX-XXX-XXXX for mobile
      return cleanValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (type === "landline") {
      // Format landline based on length
      if (cleanValue.length === 6 || cleanValue.length === 7 || cleanValue.length === 8) {
        // Local landline without STD code
        return cleanValue.replace(/(\d{3,4})(\d{4})/, '$1-$2');
      } else if (cleanValue.length >= 10) {
        // Landline with STD code
        const stdCode = cleanValue.substring(0, cleanValue.length - 6);
        const number = cleanValue.substring(cleanValue.length - 6);
        return `(${stdCode}) ${number.substring(0, 3)}-${number.substring(3)}`;
      }
    }

    return value;
  };
  const handleCivilScoreChange = (score) => {
    handleFieldChange("civilScore", score);

    if (!score) {
      setCivilScoreText("");
      return;
    }

    const numericScore = parseInt(score);
    if (isNaN(numericScore)) {
      setCivilScoreText("Invalid score");
      return;
    }

    if (numericScore >= 0 && numericScore <= 550) {
      setCivilScoreText("Poor");
    } else if (numericScore >= 41 && numericScore <= 650) {
      setCivilScoreText("Good");
    } else if (numericScore >= 71 && numericScore <= 750) {
      setCivilScoreText("Excellent");
    }
  };

  // Handle phone number input with formatting
  const handlePhoneInputChange = (field, value) => {
    // Remove any non-digit characters except dashes and parentheses for backspace handling
    const cleanValue = value.replace(/[^\d\-\(\)]/g, '');
    handleFieldChange(field, cleanValue);
  };

  const ComboBox = ({ label, fieldName, value, options }) => {
    const [inputValue, setInputValue] = useState(value || "");

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    return (
      <Autocomplete
        freeSolo
        options={options}
        value={value || ""}
        inputValue={inputValue}
        onInputChange={(e, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(e, newVal) => {
          handleFieldChange(fieldName, newVal || "");
        }}
        onBlur={() => {
          handleFieldChange(fieldName, inputValue);
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            transition: 'all 0.2s ease-in-out',
            height: '56px', // Fixed height
            '&:hover': {
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
            },
            '&.Mui-focused': {
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
            }
          },
          '& .MuiAutocomplete-input': {
            padding: '8.5px 4px 8.5px 6px !important', // Match textfield padding
          }
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label={label}
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '0.9rem',
                fontWeight: 500,
              },
              '& .MuiInputBase-root': {
                height: '56px', // Consistent height
              }
            }}
          />
        )}
      />
    );
  };

  // DOB age logic
  const handleDateOfBirthChange = (dateString) => {
    handleFieldChange("dateOfBirth", dateString);

    if (!dateString) {
      handleFieldChange("ageInYears", "");
      handleFieldChange("isMinor", "");
      setDobError("");
      return;
    }

    const dob = new Date(dateString);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      days += 30;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const isMinor = years < 18 ? "Yes" : "No";
    setDobError("");

    handleFieldChange("ageInYears", `${years} years, ${months} months`);
    handleFieldChange("isMinor", isMinor);
  };

  // Common text field styles
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      transition: 'all 0.2s ease-in-out',
      height: '56px', // Fixed height for all text fields
      '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem',
      fontWeight: 500,
    }
  };

  return (
    <Card sx={{
      borderRadius: 4,
      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      }
    }}>
      <CardContent sx={{ p: 5 }}>
        <SectionHeader
          icon={
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 3,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <PersonIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 28
                }}
              />
            </Box>
          }
          title="Personal Information"
          subtitle="Basic member details and identification"
          sx={{
            mb: 4,
            '& .MuiTypography-h5': {
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            },
            '& .MuiTypography-subtitle1': {
              color: theme.palette.text.secondary,
              fontSize: '0.95rem',
            }
          }}
        />

        <Grid container spacing={3}>

          {/* Membership Number */}
          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Membership No."
              name="membershipNumber"
              value={personalInfo.membershipNumber || ""}
              onChange={(e) =>
                handleFieldChange("membershipNumber", e.target.value)
              }
              sx={textFieldStyles}
            />
          </Grid>

          {/* Membership Date */}
          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Membership Date"
              type="date"
              name="membershipDate"
              InputLabelProps={{ shrink: true }}
              value={personalInfo.membershipDate || ""}
              onChange={(e) =>
                handleFieldChange("membershipDate", e.target.value)
              }
              sx={textFieldStyles}
            />
          </Grid>

          {/* Credit Amount */}
          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Amount in Credit"
              name="amountInCredit"
              type="number"
              value={personalInfo.amountInCredit || ""}
              onChange={(e) =>
                handleFieldChange("amountInCredit", e.target.value)
              }
              sx={textFieldStyles}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                    ₹
                  </Box>
                ),
              }}
            />
          </Grid>

          {/* Civil Score */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <StyledTextField
                label="Civil Score"
                name="civilScore"
                type="number"
                value={personalInfo.civilScore || ""}
                onChange={(e) => handleCivilScoreChange(e.target.value)}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <Box
                      component="span"
                      sx={{
                        color: civilScoreText === "Excellent" ? 'success.main' :
                          civilScoreText === "Good" ? 'warning.main' :
                            civilScoreText === "Poor" ? 'error.main' : 'text.secondary',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        minWidth: 80,
                        textAlign: 'right'
                      }}
                    >
                      {civilScoreText}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>

          {/* Title ComboBox */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <ComboBox
                label="Title"
                fieldName="title"
                value={personalInfo.title}
                options={["Mr", "Mrs", "Miss", "Dr", "CA", "Advocate"]}
              />
            </Box>
          </Grid>

          {/* Name of Member */}
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Name of Member"
              name="nameOfMember"
              value={personalInfo.nameOfMember || ""}
              onChange={(e) => handleFieldChange("nameOfMember", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Father Title + Name */}
          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Father Title"
              fieldName="fatherTitle"
              value={personalInfo.fatherTitle}
              options={["Mr", "Dr", "CA", "Advocate"]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Name of Father"
              name="nameOfFather"
              value={personalInfo.nameOfFather || ""}
              onChange={(e) => handleFieldChange("nameOfFather", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Mother Title + Name */}
          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Mother Title"
              fieldName="motherTitle"
              value={personalInfo.motherTitle}
              options={["Mrs", "Miss", "Dr", "CA", "Advocate"]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Name of Mother"
              name="nameOfMother"
              value={personalInfo.nameOfMother || ""}
              onChange={(e) => handleFieldChange("nameOfMother", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>

          {/* DOB */}
          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              InputLabelProps={{ shrink: true }}
              value={personalInfo.dateOfBirth || ""}
              onChange={(e) => handleDateOfBirthChange(e.target.value)}
              error={!!dobError}
              helperText={dobError}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Age */}
          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Age in Years"
              name="ageInYears"
              value={personalInfo.ageInYears || ""}
              InputProps={{ readOnly: true }}
              sx={{
                ...textFieldStyles,
                '& .MuiOutlinedInput-root': {
                  ...textFieldStyles['& .MuiOutlinedInput-root'],
                }
              }}
            />
          </Grid>

          {/* Minor */}
          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Minor"
              fieldName="isMinor"
              value={personalInfo.isMinor}
              options={["Yes", "No"]}
            />
          </Grid>

          {/* Guardian Fields (if minor) */}
          {personalInfo.isMinor === "Yes" && (
            <>
              <Grid size={{ xs: 12, md: 4 }}>
                <StyledTextField
                  label="Guardian Name"
                  name="guardianName"
                  value={personalInfo.guardianName || ""}
                  onChange={(e) => handleFieldChange("guardianName", e.target.value)}
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <ComboBox
                  label="Relation with Guardian"
                  fieldName="guardianRelation"
                  value={personalInfo.guardianRelation}
                  options={[
                    "Father",
                    "Mother",
                    "Grandfather",
                    "Grandmother",
                    "Uncle",
                    "Aunt",
                  ]}
                />
              </Grid>
            </>
          )}

          {/* Gender */}
          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Gender"
              fieldName="gender"
              value={personalInfo.gender}
              options={["Male", "Female", "Other"]}
            />
          </Grid>

          {/* Religion */}
          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Religion"
              fieldName="religion"
              value={personalInfo.religion}
              options={[
                "Hindu",
                "Muslim",
                "Christian",
                "Sikh",
                "Buddhist",
                "Jain",
              ]}
            />
          </Grid>

          {/* Marital Status */}
          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Marital Status"
              fieldName="maritalStatus"
              value={personalInfo.maritalStatus}
              options={["Single", "Married", "Divorced", "Widowed"]}
            />
          </Grid>

          {/* Spouse Fields */}
          {personalInfo.maritalStatus === "Married" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <ComboBox
                    label="Spouse Title"
                    fieldName="spouseTitle"
                    value={personalInfo.spouseTitle}
                    options={["Mr", "Mrs", "Dr", "CA", "Advocate"]}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                  <StyledTextField
                    label="Name of Spouse"
                    name="nameOfSpouse"
                    value={personalInfo.nameOfSpouse || ""}
                    onChange={(e) => handleFieldChange("nameOfSpouse", e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Caste */}
          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Caste"
              fieldName="caste"
              value={personalInfo.caste}
              options={["General", "OBC", "SC", "ST"]}
            />
          </Grid>

          {/* Contact Information Section Visual Break */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                my: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: '100px',
                  height: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                }
              }}
            />
          </Grid>

          {/* Phone */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <PhoneFieldWithButton
                  label="Phone Number"
                  fieldName="phoneNo"
                  value={personalInfo.phoneNo}
                  phoneType={phoneTypes.phoneNo}
                />
              </Box>
              <Tooltip title="Add more phone numbers">
                <IconButton
                  onClick={addAdditionalPhone}
                  sx={{
                    color: 'primary.main',
                    mb: '8px',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* Alternate Phone */}
          {/* <Grid size={{ xs: 12, md: 4 }}>
            <PhoneFieldWithButton
              label="Alternate Phone Number"
              fieldName="alternatePhoneNo"
              value={personalInfo.alternatePhoneNo}
              phoneType={phoneTypes.alternatePhoneNo}
            />
          </Grid> */}

          {/* Office Number */}
          <Grid size={{ xs: 12, md: 4 }}>
            <PhoneFieldWithButton
              label="Office Landline"
              fieldName="officeNo"
              value={personalInfo.officeNo}
              phoneType={phoneTypes.officeNo}
            />
          </Grid>

          {/* Residence Number */}
          <Grid size={{ xs: 12, md: 4 }}>
            <PhoneFieldWithButton
              label="Residence Landline"
              fieldName="residenceNo"
              value={personalInfo.residenceNo}
              phoneType={phoneTypes.residenceNo}
            />
          </Grid>

          {/* Additional Phone Numbers Section */}
          {additionalPhones.map((phone) => (
            <Grid size={{ xs: 12, md: 4 }} key={phone.id}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <StyledTextField
                    label="Additional Phone Number"
                    value={formatPhoneNumber(phone.number || "", phone.type)}
                    onChange={(e) => updateAdditionalPhone(phone.id, e.target.value)}
                    onBlur={(e) => {
                      const result = validatePhoneNumber(e.target.value);
                      if (result.error) {
                        alert(result.error);
                      }
                    }}
                    inputProps={{
                      maxLength: 14,
                    }}
                    sx={textFieldStyles}
                  />
                </Box>
                <Tooltip title="Call">
                  <span>
                    <IconButton
                      onClick={() => handleCall(phone.number)}
                      disabled={!phone.number}
                      sx={{
                        color: phone.number ? 'success.main' : 'action.disabled',
                        mb: '8px'
                      }}
                    >
                      <PhoneIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton
                    onClick={() => removeAdditionalPhone(phone.id)}
                    sx={{
                      color: 'error.main',
                      mb: '8px'
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))}

          {/* Email */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
              <Box sx={{ flex: 1 }}>
                <EmailFieldWithButton
                  label="Email Id"
                  fieldName="emailId"
                  value={personalInfo.emailId}
                />
              </Box>
              <Tooltip title="Add more email addresses">
                <IconButton
                  onClick={addAdditionalEmail}
                  sx={{
                    color: 'primary.main',
                    mb: '8px',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          {/* Additional Email Addresses Section */}
          {additionalEmails.map((email) => (
            <Grid size={{ xs: 12, md: 12 }} key={email.id}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <StyledTextField
                    label="Additional Email Address"
                    type="email"
                    value={email.address || ""}
                    onChange={(e) => updateAdditionalEmail(email.id, e.target.value)}
                    onBlur={(e) => {
                      const error = validateEmail(e.target.value);
                      if (error) {
                        alert(error);
                      }
                    }}
                    sx={textFieldStyles}
                  />
                </Box>
                <Tooltip title="Send Email">
                  <span>
                    <IconButton
                      onClick={() => handleEmail(email.address)}
                      disabled={!email.address}
                      sx={{
                        color: email.address ? 'primary.main' : 'action.disabled',
                        mb: '8px'
                      }}
                    >
                      <EmailIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton
                    onClick={() => removeAdditionalEmail(email.id)}
                    sx={{
                      color: 'error.main',
                      mb: '8px'
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;