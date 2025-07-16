import React, { useState, useEffect, useRef } from "react";
import { getDocument } from "pdfjs-dist";
import Papa from "papaparse";
import "pdfjs-dist/build/pdf.worker.entry";
import "./App.css";

const categoryTree = {
  research_and_consultancy_ties: {
    "consulting_for_ffi_via_the_university": {
      "code": "CF1",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of uni personnel?",
          "key": "name_of_uni_personnel",
          "type": "text"
        },
        {
          "label": "Type of consultancy?",
          "key": "type_of_consultancy",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Remuneration?",
          "key": "remuneration",
          "type": "text"
        },
        {
          "label": "Remuneration currency?",
          "key": "remuneration_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "research_collaboration": {
      "code": "CF2",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of FFI personnel?",
          "key": "name_of_ffi_personnel",
          "type": "text"
        },
        {
          "label": "Title at FFI?",
          "key": "title_at_ffi",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Name of uni personnel?",
          "key": "name_of_uni_personnel",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Title of research project?",
          "key": "title_of_research_project",
          "type": "text"
        },
        {
          "label": "Department/academic discipline?",
          "key": "department_academic_discipline",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "unspecified_ffi_funding_for_research": {
      "code": "CF3",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of FFI personnel?",
          "key": "name_of_ffi_personnel",
          "type": "text"
        },
        {
          "label": "Title at FFI?",
          "key": "title_at_ffi",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Name of uni personnel?",
          "key": "name_of_uni_personnel",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Title of research project?",
          "key": "title_of_research_project",
          "type": "text"
        },
        {
          "label": "Department/academic discipline?",
          "key": "department_academic_discipline",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "membership_in_ffi_linked_research_consortia": {
      "code": "CF4",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of consortia?",
          "key": "name_of_consortia",
          "type": "text"
        },
        {
          "label": "Event Location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "buying_renting_or_obtaining_data_or_equipment_from_an_ffi_party": {
      "code": "CF5",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Description of equipment/data?",
          "key": "description_of_equipment_data",
          "type": "textarea"
        },
        {
          "label": "Method of obtainment?",
          "key": "method_of_obtainment",
          "type": "text"
        },
        {
          "label": "Purchase price?",
          "key": "purchase_price",
          "type": "text"
        },
        {
          "label": "Purchase currency?",
          "key": "purchase_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "other_research_ties": {
      "code": "CF6",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/Description of research tie?",
          "key": "title_description_of_research_tie",
          "type": "textarea"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    }
  },
  campus_presence: {
    "ffi_advertisements": {
      "code": "CF7",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/Ad Description?",
          "key": "title_ad_description",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Link to image of ad?",
          "key": "link_to_image_of_ad",
          "type": "text"
        },
        {
          "label": "Ad location on campus?",
          "key": "ad_location_on_campus",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_sponsored_sports_teams": {
      "code": "CF8",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Which sport?",
          "key": "which_sport",
          "type": "text"
        },
        {
          "label": "Team Name?",
          "key": "team_name",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_sponsored_student_organizations": {
      "code": "CF9",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of student organization?",
          "key": "name_of_student_organization",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_involved_panels_lectures_speeches": {
      "code": "CF10",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of Event?",
          "key": "title_of_event",
          "type": "text"
        },
        {
          "label": "Event Location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_sponsored_events_and_excursions": {
      "code": "CF11",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of Event?",
          "key": "title_of_event",
          "type": "text"
        },
        {
          "label": "Event Location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "buildings_named_after_ffi": {
      "code": "CF12",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of Building?",
          "key": "name_of_building",
          "type": "text"
        },
        {
          "label": "Amount donated?",
          "key": "amount_donated",
          "type": "text"
        },
        {
          "label": "Donation currency?",
          "key": "donation_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_office_space_on_campus": {
      "code": "CF13",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "How much office space?",
          "key": "how_much_office_space",
          "type": "text"
        },
        {
          "label": "Amount donated?",
          "key": "amount_donated",
          "type": "text"
        },
        {
          "label": "Donation currency?",
          "key": "donation_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_memorabilia": {
      "code": "CF14",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Item(s) given?",
          "key": "item_given",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Amount donated?",
          "key": "amount_donated",
          "type": "text"
        },
        {
          "label": "Donation currency?",
          "key": "donation_currency",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_sponsored_awards_and_prizes": {
      "code": "CF15",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name/title of sponsored fellowship/scholarship/award?",
          "key": "name_title_of_sponsored_fellowship_scholarship_award",
          "type": "text"
        },
        {
          "label": "Funding amount per fellowship/scholarship/award?",
          "key": "funding_amount_per_fellowship_scholarship_award",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "named_professorship_chair": {
      "code": "CF16",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of funded professorship?",
          "key": "title_of_funded_professorship",
          "type": "text"
        },
        {
          "label": "Name of appointee?",
          "key": "name_of_appointee",
          "type": "text"
        },
        {
          "label": "Department?",
          "key": "department",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "other_campus_presence": {
      "code": "CF17",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/Description of campus presence?",
          "key": "title_description_of_campus_presence",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    }
  },
  educational_involvement: {
    "curricula_advising": {
      "code": "CF18",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Level of curricula (undergrad, grad etc.)?",
          "key": "level_of_curricula",
          "type": "text"
        },
        {
          "label": "Department?",
          "key": "department",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_lectures": {
      "code": "CF19",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of Event?",
          "key": "title_of_event",
          "type": "text"
        },
        {
          "label": "Event Location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_field_trips_or_workshops": {
      "code": "CF20",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of Event?",
          "key": "title_of_event",
          "type": "text"
        },
        {
          "label": "Event Location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "other_educational_involvement": {
      "code": "CF21",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/Description of educational involvement?",
          "key": "title_description_of_educational_involvement",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Amount funded?",
          "key": "amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    }
  },
  career_and_recruitment_engagements: {
    "ffi_presence_at_career_events": {
      "code": "CF22",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of career event or job fair?",
          "key": "title_of_career_event_or_job_fair",
          "type": "text"
        },
        {
          "label": "Event location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "internships_and_jobs": {
      "code": "CF23",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/Description of Internship/Job?",
          "key": "title_description_of_internship_job",
          "type": "text"
        },
        {
          "label": "Internship/Job Location?",
          "key": "internship_job_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Remuneration (enter \u201cunknown\u201d if not specified, \u201cunpaid\u201d if internship is unpaid, otherwise enter remuneration amount)?",
          "key": "remuneration",
          "type": "text"
        },
        {
          "label": "Currency of remuneration (if applicable)?",
          "key": "currency_of_remuneration",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "ffi_sponsored_fellowships_scholarships_and_other_awards": {
      "code": "CF24",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name/title of sponsored fellowship/scholarship/award?",
          "key": "name_title_of_sponsored_fellowship_scholarship_award",
          "type": "text"
        },
        {
          "label": "Funding amount per fellowship/scholarship/award?",
          "key": "funding_amount_per_fellowship_scholarship_award",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "career_advising": {
      "code": "CF25",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Level of student being advised (undergrad, grad etc.)?",
          "key": "level_of_student_being_advised",
          "type": "text"
        },
        {
          "label": "Department?",
          "key": "department",
          "type": "text"
        },
        {
          "label": "Title/Description of Internships or Jobs?",
          "key": "title_description_of_internships_or_jobs",
          "type": "textarea"
        },
        {
          "label": "Internship/Job Location?",
          "key": "internship_job_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other relevant information?",
          "key": "other_relevant_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "networking_opportunities": {
      "code": "CF26",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of networking opportunity?",
          "key": "title_of_networking_opportunity",
          "type": "text"
        },
        {
          "label": "Networking opportunity Location?",
          "key": "networking_opportunity_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "joint_trainings_and_workshops": {
      "code": "CF27",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title of training/workshop?",
          "key": "title_of_training_workshop",
          "type": "text"
        },
        {
          "label": "Event Location?",
          "key": "event_location",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Number of FFI personnel attending?",
          "key": "number_of_ffi_personnel_attending",
          "type": "text"
        },
        {
          "label": "Names of FFI personnel attending?",
          "key": "names_of_ffi_personnel_attending",
          "type": "textarea"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "other_career_and_recruitment_engagements": {
      "code": "CF28",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/description of engagement?",
          "key": "title_description_of_engagement",
          "type": "text"
        },
        {
          "label": "Location of engagement?",
          "key": "location_of_engagement",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    }
  },
  purely_financial_relationship: {
    "gift_matching_programs": {
      "code": "CF29",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "How many individual gifts/donations were matched?",
          "key": "how_many_individual_gifts_donations_were_matched",
          "type": "text"
        },
        {
          "label": "Total amount funded?",
          "key": "total_amount_funded",
          "type": "text"
        },
        {
          "label": "Funding currency?",
          "key": "funding_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "uni_endowment_invested_in_ffi": {
      "code": "CF30",
      "form": [
        {
          "label": "FFI beneficiary of investment?",
          "key": "ffi_beneficiary_of_investment",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Amount invested?",
          "key": "amount_invested",
          "type": "text"
        },
        {
          "label": "Investment amount currency?",
          "key": "investment_amount_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "uni_land_leasing_for_fracking_drilling_or_exploration": {
      "code": "CF31",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Land usage (Fracking, exploration etc.)?",
          "key": "land_usage",
          "type": "text"
        },
        {
          "label": "On indigenous land?",
          "key": "on_indigenous_land",
          "type": "text"
        },
        {
          "label": "Size of land?",
          "key": "size_of_land",
          "type": "text"
        },
        {
          "label": "Leasing revenue received by university?",
          "key": "leasing_revenue_received_by_university",
          "type": "text"
        },
        {
          "label": "Leasing revenue currency?",
          "key": "leasing_revenue_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "donations_with_unspecified_interests_obligations_or_benefits": {
      "code": "CF32",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/description of donation?",
          "key": "title_description_of_donation",
          "type": "text"
        },
        {
          "label": "Donation amount?",
          "key": "donation_amount",
          "type": "text"
        },
        {
          "label": "Donation amount currency?",
          "key": "donation_amount_currency",
          "type": "text"
        },
        {
          "label": "Donation date (yyyy)?",
          "key": "donation_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "other_financial_relationship": {
      "code": "CF33",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/description of financial relationship?",
          "key": "title_description_of_financial_relationship",
          "type": "text"
        },
        {
          "label": "Amount exchanged?",
          "key": "amount_exchanged",
          "type": "text"
        },
        {
          "label": "Amount currency?",
          "key": "amount_currency",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    }
  },
  high_level_institutional_agreements: {
    "formal_contracts_between_ffi_and_uni": {
      "code": "CF34",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/description?",
          "key": "title_description",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Signed date (mm-dd-yyyy or mm-yyyy or yyyy)?",
          "key": "signed_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "informal_understanding_between_ffi_and_uni": {
      "code": "CF34",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/description?",
          "key": "title_description",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Signed date (mm-dd-yyyy or mm-yyyy or yyyy)?",
          "key": "signed_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "joint_ventures": {
      "code": "CF34",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Title/description?",
          "key": "title_description",
          "type": "text"
        },
        {
          "label": "Start date (yyyy)?",
          "key": "start_date",
          "type": "text"
        },
        {
          "label": "End date (yyyy)?",
          "key": "end_date",
          "type": "text"
        },
        {
          "label": "Signed date (mm-dd-yyyy or mm-yyyy or yyyy)?",
          "key": "signed_date",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    }
  },
  personnel_overlap: {
    "former_ffi_personnel_now_affiliated_with_uni": {
      "code": "CF35",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of personnel?",
          "key": "name_of_personnel",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Title at FFI?",
          "key": "title_at_ffi",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Remuneration?",
          "key": "remuneration",
          "type": "text"
        },
        {
          "label": "Remuneration currency?",
          "key": "remuneration_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "former_uni_personnel_now_affiliated_with_ffi": {
      "code": "CF35",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of personnel?",
          "key": "name_of_personnel",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Title at FFI?",
          "key": "title_at_ffi",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Remuneration?",
          "key": "remuneration",
          "type": "text"
        },
        {
          "label": "Remuneration currency?",
          "key": "remuneration_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "concurrently_affiliated_with_both_ffi_and_uni": {
      "code": "CF35",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of personnel?",
          "key": "name_of_personnel",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Title at FFI?",
          "key": "title_at_ffi",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Remuneration?",
          "key": "remuneration",
          "type": "text"
        },
        {
          "label": "Remuneration currency?",
          "key": "remuneration_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
        }
      ]
    },
    "other_personnel_overlap": {
      "code": "CF35",
      "form": [
        {
          "label": "Which FFI?",
          "key": "which_ffi",
          "type": "text"
        },
        {
          "label": "Which university?",
          "key": "which_university",
          "type": "text"
        },
        {
          "label": "Name of personnel?",
          "key": "name_of_personnel",
          "type": "text"
        },
        {
          "label": "Title at university?",
          "key": "title_at_university",
          "type": "text"
        },
        {
          "label": "Start date at university (yyyy)?",
          "key": "start_date_at_university",
          "type": "text"
        },
        {
          "label": "End date at university (yyyy)?",
          "key": "end_date_at_university",
          "type": "text"
        },
        {
          "label": "Title at FFI?",
          "key": "title_at_ffi",
          "type": "text"
        },
        {
          "label": "Start date at FFI (yyyy)?",
          "key": "start_date_at_ffi",
          "type": "text"
        },
        {
          "label": "End date at FFI (yyyy)?",
          "key": "end_date_at_ffi",
          "type": "text"
        },
        {
          "label": "Remuneration?",
          "key": "remuneration",
          "type": "text"
        },
        {
          "label": "Remuneration currency?",
          "key": "remuneration_currency",
          "type": "text"
        },
        {
          "label": "Other information?",
          "key": "other_information",
          "type": "textarea"
        },
        {
          "label": "Apparent influence?",
          "key": "apparent_influence",
          "type": "text"
        },
        {
          "label": "Noteworthy?",
          "key": "noteworthy",
          "type": "checkbox"
        },
        {
          "label": "Source(s) other than Survey Report?",
          "key": "source_other_than_survey_report",
          "type": "text"
        },
        {
          "label": "Evidence/Quote(s) from sources other than Survey Report?",
          "key": "evidence_quote_from_sources_other_than_survey_report",
          "type": "textarea"
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

  const [boxes, setBoxes] = useState(() => {
    const saved = localStorage.getItem("savedBoxes");
    return saved ? JSON.parse(saved) : [];
  });
  const [drawingBox, setDrawingBox] = useState(null);
  const containerRef = useRef(null);
  const startCoords = useRef(null);

  useEffect(() => {
    localStorage.setItem("savedBoxes", JSON.stringify(boxes));
  }, [boxes]);


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

    const rows = boxes
      .filter(box => !box.previous) // ❗ Ignore previous labeler’s boxes
      .map(box => {
        const { page, x, y, width, height, label } = box;
        const { macro, meso, code, fields = {} } = label;

        const row = {
          page, x, y, width, height,
          macro, meso, code
        };

        allFieldKeys.forEach(prefixedKey => {
          row[prefixedKey] = "";
        });

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
    }));eeeeeee

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
      <button onClick={() => localStorage.removeItem("savedBoxes")}>
        Clear Saved Boxes
      </button>
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
                  <label>
                    {f.label}
                    {f.type === 'textarea' ? (
                      <textarea
                        value={formData.fields[f.key] || ''}
                        onChange={e => updateField(f.key, e.target.value)}
                      />
                    ) : f.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={!!formData.fields[f.key]}
                        onChange={e => updateField(f.key, e.target.checked)}
                      />
                    ) : (
                      <input
                        type={f.type}
                        value={formData.fields[f.key] || ''}
                        onChange={e => updateField(f.key, e.target.value)}
                      />
                    )}
                  </label>
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
