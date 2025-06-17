import React, { useState, useEffect, useRef } from "react";
import { getDocument } from "pdfjs-dist";
import Papa from "papaparse";
import "pdfjs-dist/build/pdf.worker.entry";
import "./App.css";



const categoryTree = {
  Research_and_consultancy_ties: {
    "Consulting_for_FFI_via_the_university": {
      code: "CF1_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of uni personnel?",
          key: "name_of_uni_personnel",
          type: "text"
        },
        {
          label: "Type of consultancy?",
          key: "type_of_consultancy",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Remuneration?",
          key: "remuneration",
          type: "text"
        },
        {
          label: "Remuneration currency?",
          key: "remuneration_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Direct_research_collaboration": {
      code: "CF2_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of FFI personnel?",
          key: "name_of_ffi_personnel",
          type: "text"
        },
        {
          label: "Title at FFI?",
          key: "title_at_ffi",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Name of uni personnel?",
          key: "name_of_uni_personnel",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Title of research project?",
          key: "title_of_research_project",
          type: "text"
        },
        {
          label: "Department/academic discipline?",
          key: "departmentacademic_discipline",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_FFI_funding_for_research": {
      code: "CF2_2",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of FFI personnel?",
          key: "name_of_ffi_personnel",
          type: "text"
        },
        {
          label: "Title at FFI?",
          key: "title_at_ffi",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Name of uni personnel?",
          key: "name_of_uni_personnel",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Title of research project?",
          key: "title_of_research_project",
          type: "text"
        },
        {
          label: "Department/academic discipline?",
          key: "departmentacademic_discipline",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Membership_in_FFI_linked_research_consortia": {
      code: "CF3_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of consortia?",
          key: "name_of_consortia",
          type: "text"
        },
        {
          label: "Event Location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Indirect_financing_or_involvement_in_research": {
      code: "CF4_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Type of FFI involvement?",
          key: "type_of_ffi_involvement",
          type: "textarea"
        },
        {
          label: "Title of funded research?",
          key: "title_of_funded_research",
          type: "text"
        },
        {
          label: "Department/academic discipline?",
          key: "departmentacademic_discipline",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Buying_renting_or_obtaining_data_or_equipment_from_an_FFI_party": {
      code: "CF5_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Description of equipment/data?",
          key: "description_of_equipmentdata",
          type: "text"
        },
        {
          label: "Bought, rented, or obtained?",
          key: "bought_rented_or_obtained",
          type: "text"
        },
        {
          label: "Purchase price?",
          key: "purchase_price",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_research_ties": {
      code: "CF5_2",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/Description of research tie?",
          key: "titledescription_of_research_tie",
          type: "textarea"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  },
  Campus_Presence: {
    "FFI_advertisements": {
      code: "CF6_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/Ad Description",
          key: "titlead_description",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Link to image of ad?",
          key: "link_to_image_of_ad",
          type: "text"
        },
        {
          label: "Ad location on campus?",
          key: "ad_location_on_campus",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_sponsored_sports_teams": {
      code: "CF7_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Which sport?",
          key: "which_sport",
          type: "text"
        },
        {
          label: "Team Name?",
          key: "team_name",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_sponsored_student_organizations": {
      code: "CF8_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of student organization?",
          key: "name_of_student_organization",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_involved_panels_lectures_speeches_when_organised_outside_of_study_program_": {
      code: "CF9_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of Event?",
          key: "title_of_event",
          type: "text"
        },
        {
          label: "Event Location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_sponsored_events_and_excursions_outside_of_study_program_": {
      code: "CF10_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of Event?",
          key: "title_of_event",
          type: "text"
        },
        {
          label: "Event Location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Buildings_named_after_FFI": {
      code: "CF11_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of Building?",
          key: "name_of_building",
          type: "text"
        },
        {
          label: "Amount donated?",
          key: "amount_donated",
          type: "text"
        },
        {
          label: "Donation currency?",
          key: "donation_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_office_space_on_campus": {
      code: "CF12_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "How much office space?",
          key: "how_much_office_space",
          type: "text"
        },
        {
          label: "Amount donated?",
          key: "amount_donated",
          type: "text"
        },
        {
          label: "Donation currency?",
          key: "donation_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_memorabilia": {
      code: "CF13_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Item(s) given?",
          key: "items_given",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Amount donated?",
          key: "amount_donated",
          type: "text"
        },
        {
          label: "Donation currency?",
          key: "donation_currency",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_sponsored_awards_and_prizes_when_not_related_to_study_program_": {
      code: "CF14_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name/title of sponsored fellowship/scholarship/award?",
          key: "nametitle_of_sponsored_fellowshipscholarshipaward",
          type: "text"
        },
        {
          label: "Funding amount per fellowship/scholarship/award?",
          key: "funding_amount_per_fellowshipscholarshipaward",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Named_professorship_chair": {
      code: "CF15_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of funded professorship?",
          key: "title_of_funded_professorship",
          type: "text"
        },
        {
          label: "Name of appointee?",
          key: "name_of_appointee",
          type: "text"
        },
        {
          label: "Department?",
          key: "department",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_campus_presence": {
      code: "CF16_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/Description of campus presence?",
          key: "titledescription_of_campus_presence",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  },
  Educational_Ties: {
    "Curricula_advising": {
      code: "CF17_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Level of curricula (undergrad, grad etc.)",
          key: "level_of_curricula_undergrad_grad_etc",
          type: "text"
        },
        {
          label: "Department?",
          key: "department",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Guest_lectures_or_seminars_by_FFI_personnel_or_on_FFI_project_case_study": {
      code: "CF18_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of Event?",
          key: "title_of_event",
          type: "text"
        },
        {
          label: "Event Location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_field_trips_or_workshops_as_part_of_study_program": {
      code: "CF19_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of Event?",
          key: "title_of_event",
          type: "text"
        },
        {
          label: "Event Location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_trajectory_degree": {
      code: "CF20_1",
      form: [
        {
          label: "Degree Title?",
          key: "degree_title",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Department?",
          key: "department",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_educational_involvement": {
      code: "CF21_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/Description of educational involvement?",
          key: "titledescription_of_educational_involvement",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Amount funded?",
          key: "amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  },
  Career_and_recruitment_engagements: {
    "Career_events_and_job_fairs_with_attendance_of_FFI": {
      code: "CF22_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of career event or job fair?",
          key: "title_of_career_event_or_job_fair",
          type: "text"
        },
        {
          label: "Event location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Internships_and_jobs_in_collaboration_with_the_university": {
      code: "CF23_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/Description of Internship/Job?",
          key: "titledescription_of_internshipjob",
          type: "text"
        },
        {
          label: "Internship/Job Location?",
          key: "internshipjob_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Remuneration (enter \u201cunknown\u201d if not specified, \u201cunpaid\u201d if internship is unpaid, otherwise enter remuneration amount)?",
          key: "remuneration_enter_unknown_if_not_specified_unpaid_if_internship_is_unpaid_otherwise_enter_remuneration_amount",
          type: "text"
        },
        {
          label: "Currency of remuneration (if applicable)?",
          key: "currency_of_remuneration_if_applicable",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "FFI_sponsored_fellowships_scholarships_and_other_awards": {
      code: "CF24_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name/title of sponsored fellowship/scholarship/award?",
          key: "nametitle_of_sponsored_fellowshipscholarshipaward",
          type: "text"
        },
        {
          label: "Funding amount per fellowship/scholarship/award?",
          key: "funding_amount_per_fellowshipscholarshipaward",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Career_advising": {
      code: "CF25_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Level of student being advised (undergrad, grad etc.)",
          key: "level_of_student_being_advised_undergrad_grad_etc",
          type: "text"
        },
        {
          label: "Department?",
          key: "department",
          type: "text"
        },
        {
          label: "Title/Description of Internships or Jobs?",
          key: "titledescription_of_internships_or_jobs",
          type: "textarea"
        },
        {
          label: "Internship/Job Location?",
          key: "internshipjob_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other relevant information?",
          key: "other_relevant_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Networking_opportunities": {
      code: "CF26_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of networking opportunity?",
          key: "title_of_networking_opportunity",
          type: "text"
        },
        {
          label: "Networking opportunity Location?",
          key: "networking_opportunity_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Joint_training_and_workshops": {
      code: "CF27_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title of training/workshop?",
          key: "title_of_trainingworkshop",
          type: "text"
        },
        {
          label: "Event Location?",
          key: "event_location",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Number of FFI personnel attending?",
          key: "number_of_ffi_personnel_attending",
          type: "text"
        },
        {
          label: "Names of FFI personnel attending?",
          key: "names_of_ffi_personnel_attending",
          type: "textarea"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_career_recruitment_engagements": {
      code: "CF28_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/description of engagement?",
          key: "titledescription_of_engagement",
          type: "text"
        },
        {
          label: "Location of engagement?",
          key: "location_of_engagement",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  },
  Purely_Financial_Relationship: {
    "Gift_matching_programs": {
      code: "CF29_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "How many individual gifts/donations were matched?",
          key: "how_many_individual_giftsdonations_were_matched",
          type: "text"
        },
        {
          label: "Total amount funded?",
          key: "total_amount_funded",
          type: "text"
        },
        {
          label: "Funding currency?",
          key: "funding_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Uni_endowment_invested_in_FFI": {
      code: "CF30_1",
      form: [
        {
          label: "FFI beneficiary of investment?",
          key: "ffi_beneficiary_of_investment",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Amount invested?",
          key: "amount_invested",
          type: "text"
        },
        {
          label: "Investment amount currency?",
          key: "investment_amount_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Uni_land_leasing_for_fracking_drilling_or_exploration": {
      code: "CF31_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Land usage (Fracking, exploration etc.)",
          key: "land_usage_fracking_exploration_etc",
          type: "text"
        },
        {
          label: "On indigenous land?",
          key: "on_indigenous_land",
          type: "select"
        },
        {
          label: "Size of land?",
          key: "size_of_land",
          type: "text"
        },
        {
          label: "Leasing revenue received by university?",
          key: "leasing_revenue_received_by_university",
          type: "text"
        },
        {
          label: "Leasing revenue currency?",
          key: "leasing_revenue_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Donations_with_unspecified_interests_obligations_or_benefits": {
      code: "CF32_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/description of donation?",
          key: "titledescription_of_donation",
          type: "text"
        },
        {
          label: "Donation amount?",
          key: "donation_amount",
          type: "text"
        },
        {
          label: "Donation amount currency?",
          key: "donation_amount_currency",
          type: "text"
        },
        {
          label: "Donation date (yyyy)?",
          key: "donation_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_Financial_Relationship": {
      code: "CF33_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/description of financial relationship?",
          key: "titledescription_of_financial_relationship",
          type: "text"
        },
        {
          label: "Amount exchanged?",
          key: "amount_exchanged",
          type: "text"
        },
        {
          label: "Amount currency?",
          key: "amount_currency",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  },
  High_Level_Institutional_Agreements: {
    "Formal_contracts_between_FFI_and_uni": {
      code: "CF34_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/description?",
          key: "titledescription",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Signed date (mm-dd-yyyy or mm-yyyy or yyyy)?",
          key: "signed_date_mmddyyyy_or_mmyyyy_or_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Informal_understanding_between_FFI_and_Uni": {
      code: "CF34_2",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/description?",
          key: "titledescription",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Signed date (mm-dd-yyyy or mm-yyyy or yyyy)?",
          key: "signed_date_mmddyyyy_or_mmyyyy_or_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Joint_Ventures": {
      code: "CF34_3",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Title/description?",
          key: "titledescription",
          type: "text"
        },
        {
          label: "Start date (yyyy)?",
          key: "start_date_yyyy",
          type: "text"
        },
        {
          label: "End date (yyyy)?",
          key: "end_date_yyyy",
          type: "text"
        },
        {
          label: "Signed date (mm-dd-yyyy or mm-yyyy or yyyy)?",
          key: "signed_date_mmddyyyy_or_mmyyyy_or_yyyy",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  },
  Personnel_Overlap: {
    "Former_FFI_personnel_now_affiliated_with_Uni": {
      code: "CF35_1",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of personnel?",
          key: "name_of_personnel",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Title at FFI?",
          key: "title_at_ffi",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Remuneration?",
          key: "remuneration",
          type: "text"
        },
        {
          label: "Remuneration currency?",
          key: "remuneration_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Former_Uni_personnel_now_affiliated_with_FFI": {
      code: "CF35_2",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of personnel?",
          key: "name_of_personnel",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Title at FFI?",
          key: "title_at_ffi",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Remuneration?",
          key: "remuneration",
          type: "text"
        },
        {
          label: "Remuneration currency?",
          key: "remuneration_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Concurrently_affiliated_with_both_FFi_and_Uni": {
      code: "CF35_3",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of personnel?",
          key: "name_of_personnel",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Title at FFI?",
          key: "title_at_ffi",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Remuneration?",
          key: "remuneration",
          type: "text"
        },
        {
          label: "Remuneration currency?",
          key: "remuneration_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    },
    "Other_personnel_overlap": {
      code: "CF35_4",
      form: [
        {
          label: "Which FFI?",
          key: "which_ffi",
          type: "text"
        },
        {
          label: "Which University?",
          key: "which_uni",
          type: "text"
        },
        {
          label: "Name of personnel?",
          key: "name_of_personnel",
          type: "text"
        },
        {
          label: "Title at university?",
          key: "title_at_university",
          type: "text"
        },
        {
          label: "Start date at university (yyyy)?",
          key: "start_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "End date at university (yyyy)?",
          key: "end_date_at_university_yyyy",
          type: "text"
        },
        {
          label: "Title at FFI?",
          key: "title_at_ffi",
          type: "text"
        },
        {
          label: "Start date at FFI (yyyy)?",
          key: "start_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "End date at FFI (yyyy)?",
          key: "end_date_at_ffi_yyyy",
          type: "text"
        },
        {
          label: "Remuneration?",
          key: "remuneration",
          type: "text"
        },
        {
          label: "Remuneration currency?",
          key: "remuneration_currency",
          type: "text"
        },
        {
          label: "Other information?",
          key: "other_information",
          type: "textarea"
        },
        {
          label: "Apparent influence?",
          key: "apparent_influence",
          type: "text"
        },
        {
          label: "Noteworthy?",
          key: "noteworthy",
          type: "checkbox"
        },
        {
          label: "Source(s) other than Survey Report?",
          key: "sources_other_than_survey_report",
          type: "text"
        },
        {
          label: "Evidence/Quote(s) from sources other than Survey Report?",
          key: "evidencequotes_from_sources_other_than_survey_report",
          type: "textarea"
        }
      ]
    }
  }
};


const categoryColors = {
  "Research_and_consultancy_ties": "red",
  "Campus_Presence": "blue",
  "Educational_Ties": "green",
  "Career_and_recruitment_engagements": "orange",
  "Purely_Financial_Relationship": "purple",
  "High_Level_Institutional_Agreements": "pink",
  "Personnel_Overlap": "yellow"
};

const getAllCodePrefixedKeys = (categoryTree) => {
  const keys = new Set();

  Object.values(categoryTree).forEach(mesoMap => {
    Object.values(mesoMap).forEach(({ code, form }) => {
      form.forEach(field => keys.add(`${code}_${field.key}`));
    });
  });

  return Array.from(keys);
};

const App = () => {
  const [pdf, setPdf] = useState(null);
  const [pageImage, setPageImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pendingBox, setPendingBox] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ macro: "", meso: "", fields: {} });
  const [labelPrefix, setLabelPrefix] = useState("");
  const [labelCount, setLabelCount] = useState(1);



  useEffect(() => {
    const loadPDF = async () => {
      const loadingTask = getDocument("/input.pdf");
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
    };
    loadPDF();
  }, []);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf) return;
      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      setPageImage(canvas.toDataURL());
    };
    renderPage();
  }, [pdf, currentPage]);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  const [boxes, setBoxes] = useState([]);
  const [drawingBox, setDrawingBox] = useState(null);
  const containerRef = useRef(null);
  const startCoords = useRef(null);

  const handleMouseDown = (e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    startCoords.current = { x, y };
    setDrawingBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!startCoords.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const startX = startCoords.current.x;
    const startY = startCoords.current.y;

    setDrawingBox({
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      width: Math.abs(x - startX),
      height: Math.abs(y - startY)
    });
  };

  const handleMouseUp = () => {
    if (drawingBox) {
      setPendingBox({ ...drawingBox, page: currentPage });
      setShowForm(true);
    }
    startCoords.current = null;
    setDrawingBox(null);
  };

  const handleMacroChange = e => {
    setFormData({ macro: e.target.value, meso: "", fields: {} });
  };

  const handleMesoChange = e => {
    setFormData(data => ({ ...data, meso: e.target.value, fields: {} }));
  };

  const updateField = (key, value) => {
    setFormData(data => ({
      ...data,
      fields: { ...data.fields, [key]: value }
    }));
  };

  const handleSave = () => {
    const { macro, meso, fields } = formData;
    const code = categoryTree[macro][meso].code;
    const labelCode = labelPrefix ? `${labelPrefix}_${labelCount}` : `${labelCount}`;
    
    const newBox = {
      ...pendingBox,
      label: { macro, meso, code, fields, labelCode }
    };

    setBoxes([...boxes, newBox]);
    setLabelCount(labelCount + 1);
    resetForm();
  };

  const handleCancel = () => resetForm();

  const resetForm = () => {
    setPendingBox(null);
    setShowForm(false);
    setFormData({ macro: "", meso: "", fields: {} });
  };

  const handleDownloadCSV = () => {
    const allFieldKeys = getAllCodePrefixedKeys(categoryTree);

    const rows = boxes.map(box => {
      const { page, x, y, width, height, label } = box;
      const { macro, meso, code, fields = {}, labelCode } = label;

      const row = {
        page,
        x,
        y,
        width,
        height,
        macro,
        meso,
        code,
        labelCode: labelCode || ""  // Include labelCode
      };

      // Add all prefixed keys, default to blank
      allFieldKeys.forEach(prefixedKey => {
        row[prefixedKey] = "";
      });

      // Fill in only the fields relevant to this code
      Object.entries(fields).forEach(([key, value]) => {
        const fullKey = `${code}_${key}`;
        row[fullKey] = value;
      });

      return row;
    });

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "labels.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleDownloadCoordsCSV = () => {
    const coordRows = boxes.map(box => ({
      page: box.page,
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height
    }));

    const csv = Papa.unparse(coordRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "box_coordinates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadPreviousBoxes = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedBoxes = results.data.map(row => ({
          x: parseFloat(row.x),
          y: parseFloat(row.y),
          width: parseFloat(row.width),
          height: parseFloat(row.height),
          page: parseInt(row.page),
          previous: true // Mark as read-only/previous
        }));

        setBoxes(prev => [...prev, ...importedBoxes]);
      }
    });
  };


return (
  <div style={{ textAlign: "center" }}>
    <h1>PDF Label App</h1>

    <div style={{ margin: "1rem" }}>
      <label>
        Load previous boxes (CSV):
        <input type="file" accept=".csv" onChange={handleLoadPreviousBoxes} style={{ marginLeft: "0.5rem" }} />
      </label>
    </div>

    <div style={{ margin: "1rem" }}>
      <label>
        Label Code Prefix:&nbsp;
        <input
          type="text"
          value={labelPrefix}
          onChange={(e) => {
            setLabelPrefix(e.target.value);
            setLabelCount(1); // reset count when prefix changes
          }}
          style={{ width: "60px", padding: "0.3rem" }}
        />
      </label>
    </div>

    <div className="controls" style={{ margin: "1rem" }}>
      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        ⏮ First
      </button>
      <button onClick={goToPrevPage} disabled={currentPage === 1}>
        ⬅ Previous
      </button>

      <span style={{ margin: "0 1rem" }}>
        Page {currentPage} of {numPages}
      </span>

      <button onClick={goToNextPage} disabled={currentPage === numPages}>
        Next ➡
      </button>
      <button onClick={() => setCurrentPage(numPages)} disabled={currentPage === numPages}>
        Last ⏭
      </button>

      <input
        type="number"
        min="1"
        max={numPages}
        placeholder="Go to page"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = parseInt(e.target.value);
            if (val >= 1 && val <= numPages) {
              setCurrentPage(val);
              e.target.value = ""; // clear after jump
            }
          }
        }}
        style={{ marginLeft: "1rem", width: "100px", padding: "0.3rem" }}
      />

      <button onClick={handleDownloadCSV}>Download CSV</button>
      <button onClick={handleDownloadCoordsCSV}>Download Coordinates Only</button>
    </div>


    <div className="main-layout">
      {/* PDF Viewer Section */}
      {pageImage && (
        <div
          className="pdf-viewer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={containerRef}
        >
          <img
            src={pageImage}
            alt={`Page ${currentPage}`}
            style={{ display: "block", userSelect: "none", pointerEvents: "none" }}
          />

          {/* Render existing boxes */}
          {boxes
            .filter(b => b.page === currentPage)
            .map((box, idx) => {
              const isPrevious = box.previous;
              const macro = box.label?.macro;
              const color = isPrevious ? "gray" : (categoryColors[macro] || "black");

              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: box.x,
                    top: box.y,
                    width: box.width,
                    height: box.height,
                    border: `2px ${isPrevious ? "dotted" : "solid"} ${color}`,
                    pointerEvents: "none"
                  }}
                  title={
                    isPrevious
                      ? "Previous label"
                      : `${box.label.macro} / ${box.label.meso} (${box.label.code})`
                  }
                />
              );
            })}

          {/* Draw the current box in progress */}
          {drawingBox && (
            <div
              style={{
                position: "absolute",
                left: drawingBox.x,
                top: drawingBox.y,
                width: drawingBox.width,
                height: drawingBox.height,
                border: "2px dashed blue"
              }}
            />
          )}
        </div>
      )}

      {/* Form Sidebar */}
      {showForm && (
        <div className="form-container">
          <select value={formData.macro} onChange={handleMacroChange}>
            <option value="">Select Macro</option>
            {Object.keys(categoryTree).map(macro => (
              <option key={macro}>{macro}</option>
            ))}
          </select>

          {formData.macro && (
            <select value={formData.meso} onChange={handleMesoChange}>
              <option value="">Select Meso</option>
              {Object.keys(categoryTree[formData.macro]).map(meso => (
                <option key={meso}>{meso}</option>
              ))}
            </select>
          )}

          {formData.macro && formData.meso && (
            <div className="dynamic-fields">
              {categoryTree[formData.macro][formData.meso].form.map(f => (
                <div key={f.key}>
                  <label>{f.label}</label>
                  {f.type === 'textarea'
                    ? <textarea value={formData.fields[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
                    : <input type={f.type} value={formData.fields[f.key] || ''} onChange={e => updateField(f.key, e.target.value)} />
                  }
                </div>
              ))}
            </div>
          )}

          <div className="form-buttons">
            <button onClick={handleSave} disabled={!formData.macro || !formData.meso}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  </div>
)};


export default App;
