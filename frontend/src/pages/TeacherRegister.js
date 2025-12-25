import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEACHING_FIELDS } from "../data/TeachingFields";
import { PROGRAMS, getProgramsByField } from "../data/Programs";
import { EDU_SUBJECTS } from "../EduTutor/data/EduSubjects";
import { FaTimesCircle } from "react-icons/fa";
import "../styles/teacher/TeacherRegisterBase.css";
import "../styles/teacher/TeacherRegisterForm.css";

// Import step components
import TeacherRegisterHeader from "../components/teacher/TeacherRegisterHeader";
import TeacherRegisterStep1 from "../components/teacher/TeacherRegisterStep1";
import TeacherRegisterStep2 from "../components/teacher/TeacherRegisterStep2";
import TeacherRegisterStep3 from "../components/teacher/TeacherRegisterStep3";
import TeacherRegisterStep4 from "../components/teacher/TeacherRegisterStep4";
import TeacherRegisterNavigation from "../components/teacher/TeacherRegisterNavigation";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TeacherRegister() {
    const navigate = useNavigate();

    // Form State
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        experienceYears: "",
        bio: "",
        fieldId: "",
        programId: "",
        teachingMode: "online",
        onlinePrice: "",
        offlinePrice: "",
        offlineLocation: "",
    });

    // Slot state - new format
    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slots, setSlots] = useState([]);

    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [subjectQuery, setSubjectQuery] = useState("");
    const [qualificationFile, setQualificationFile] = useState(null);
    const [idProofFile, setIdProofFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    // Derived Lists
    const activeFields = useMemo(
        () => (TEACHING_FIELDS || []).filter((f) => f.enabled !== false),
        []
    );

    const filteredPrograms = useMemo(() => {
        if (!form.fieldId) return [];
        return getProgramsByField(form.fieldId);
    }, [form.fieldId]);

    const subjectSuggestions = useMemo(() => {
        const q = subjectQuery.trim().toLowerCase();
        const pool = EDU_SUBJECTS || [];

        // Filter by branch first if possible
        let filtered = pool;
        if (form.programId) {
            // Check if any subjects match the branchId
            const branchSpecific = pool.filter(s => s.branchId === form.programId);
            if (branchSpecific.length > 0) {
                filtered = branchSpecific;
            }
        }

        if (!q) return filtered.slice(0, 50);

        return filtered
            .filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    (s.tags || []).some((t) => t.toLowerCase().includes(q))
            )
            .slice(0, 50);
    }, [subjectQuery, form.programId]);

    // Helpers
    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "fieldId") {
            setForm((prev) => ({ ...prev, programId: "" }));
        }
    };

    const addSlot = () => {
        // Validate inputs
        if (selectedDays.length === 0 || !startTime || !endTime) {
            alert("Please select days and set start/end times");
            return;
        }

        if (startTime >= endTime) {
            alert("End time must be after start time");
            return;
        }

        // Create slots for each selected day
        const newSlots = selectedDays.map(day => ({
            day,
            startTime,
            endTime
        }));

        setSlots((prev) => [...prev, ...newSlots]);

        // Clear selections
        setSelectedDays([]);
        setStartTime("");
        setEndTime("");
    };

    const removeSlot = (index) => {
        setSlots((prev) => prev.filter((_, i) => i !== index));
    };

    const addSubjectBySuggestion = (subj) => {
        if (!subj?.id) return;
        if (selectedSubjects.some((s) => s.id === subj.id)) return;
        setSelectedSubjects((prev) => [...prev, { id: subj.id, name: subj.name }]);
        setSubjectQuery("");
    };

    const addSubjectFreeText = () => {
        const name = subjectQuery.trim();
        if (!name) return;
        const id = name.toLowerCase().replace(/\s+/g, "_");
        if (selectedSubjects.some((s) => s.id === id)) return;
        setSelectedSubjects((prev) => [...prev, { id, name }]);
        setSubjectQuery("");
    };

    const removeSubject = (id) => {
        setSelectedSubjects((prev) => prev.filter((s) => s.id !== id));
    };

    // Validation per step
    const isStepValid = (step) => {
        switch (step) {
            case 1:
                return form.fullName && form.email && form.phone && form.password && form.experienceYears && form.bio;
            case 2:
                return form.fieldId && form.programId && selectedSubjects.length > 0 && form.teachingMode;
            case 3:
                const { teachingMode, onlinePrice, offlinePrice, offlineLocation } = form;
                if (teachingMode === "online") return !!onlinePrice;
                if (teachingMode === "offline") return !!offlinePrice && !!offlineLocation;
                if (teachingMode === "both") return !!onlinePrice && !!offlinePrice && !!offlineLocation;
                return false;
            case 4:
                return slots.length > 0;
            default:
                return false;
        }
    };

    // Navigation
    const goToNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Submit Handler
    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            const selectedField = TEACHING_FIELDS.find((f) => f.id === form.fieldId);
            const selectedProgram = PROGRAMS.find((p) => p.id === form.programId);

            if (!selectedField || !selectedProgram) {
                throw new Error("Please select valid teaching field and program");
            }

            const requestBody = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                experienceYears: form.experienceYears,
                bio: form.bio,
                teachingField: {
                    fieldId: selectedField.id,
                    fieldName: selectedField.name,
                },
                program: {
                    programId: selectedProgram.id,
                    programName: selectedProgram.name,
                },
                selectedSubjects: selectedSubjects.map((s) => s.name),
                teachingMode: form.teachingMode,
                onlinePrice: form.onlinePrice || null,
                offlinePrice: form.offlinePrice || null,
                offlineLocation: form.offlineLocation || null,
                slots: slots,  // Already in correct format: [{day, startTime, endTime}]
                qualificationFile: qualificationFile || null,
                idProofFile: idProofFile || null,
            };

            const response = await fetch(`${API_URL}/api/auth/register-teacher`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            alert(data.message || "Teacher registered successfully!");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Render Step Content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <TeacherRegisterStep1 form={form} updateField={updateField} />;
            case 2:
                return (
                    <TeacherRegisterStep2
                        form={form}
                        updateField={updateField}
                        activeFields={activeFields}
                        filteredPrograms={filteredPrograms}
                        selectedSubjects={selectedSubjects}
                        subjectQuery={subjectQuery}
                        setSubjectQuery={setSubjectQuery}
                        subjectSuggestions={subjectSuggestions}
                        addSubjectBySuggestion={addSubjectBySuggestion}
                        addSubjectFreeText={addSubjectFreeText}
                        removeSubject={removeSubject}
                    />
                );
            case 3:
                return <TeacherRegisterStep3 form={form} updateField={updateField} />;
            case 4:
                return (
                    <TeacherRegisterStep4
                        selectedDays={selectedDays}
                        setSelectedDays={setSelectedDays}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        slots={slots}
                        addSlot={addSlot}
                        removeSlot={removeSlot}
                        setQualificationFile={setQualificationFile}
                        setIdProofFile={setIdProofFile}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="teacher-register-modern">
            {/* Sticky Header */}
            <TeacherRegisterHeader
                currentStep={currentStep}
                goToStep={goToStep}
                isStepValid={isStepValid}
            />

            {/* Main Content */}
            <div className="register-content-wrapper">
                <div className="register-max-width">
                    {error && (
                        <div className="error-banner-modern">
                            <FaTimesCircle /> {error}
                        </div>
                    )}

                    {/* Step Content Card */}
                    <div className="register-card-modern">{renderStepContent()}</div>

                    {/* Navigation Buttons */}
                    <TeacherRegisterNavigation
                        currentStep={currentStep}
                        goToPrevStep={goToPrevStep}
                        goToNextStep={goToNextStep}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        isStepValid={isStepValid}
                    />
                </div>
            </div>
        </div>
    );
}
