% course(CourseID, Difficulty, Department)
% prerequisite(CourseID, RequiredCourseID)

:- dynamic completed/2.
:- dynamic student_preference/2.
:- dynamic prefers_difficulty/2.

:- discontiguous course/3.
:- discontiguous prerequisite/2.


% CSE
course(math1, easy, computer_and_systems).
course(math2, easy, computer_and_systems).
course(linear_algebra, easy, computer_and_systems).
course(differential_equations, medium, computer_and_systems).
course(numerical_computing, medium, computer_and_systems).
course(operations_research, medium, computer_and_systems).
course(algorithm_design_analysis, hard, computer_and_systems).
course(digital_modern_control, hard, computer_and_systems).
course(compilers_intro, hard, computer_and_systems).

course(mechanics1, easy, computer_and_systems).
course(mechanics2, easy, computer_and_systems).
course(probability_computer_apps, medium, computer_and_systems).
course(statistical_methods, medium, computer_and_systems).
course(discrete_structures, medium, computer_and_systems).
course(data_structures_algorithms, medium, computer_and_systems).
course(computer_networks, medium, computer_and_systems).
course(embedded_control_systems, hard, computer_and_systems).
course(parallel_distributed, hard, computer_and_systems).
course(information_theory_multimedia, hard, computer_and_systems).

course(physics1, easy, computer_and_systems).
course(physics2, easy, computer_and_systems).
course(programming1, easy, computer_and_systems).
course(data_structures1, medium, computer_and_systems).
course(programming2, medium, computer_and_systems).
course(programming_languages, medium, computer_and_systems).
course(software_engineering, medium, computer_and_systems).
course(computer_architecture, hard, computer_and_systems).

% Prerequisites - CSE
prerequisite(math2, math1).
prerequisite(linear_algebra, math2).
prerequisite(differential_equations, math2).
prerequisite(numerical_computing, differential_equations).
prerequisite(operations_research, numerical_computing).
prerequisite(algorithm_design_analysis, operations_research).
prerequisite(digital_modern_control, algorithm_design_analysis).
prerequisite(compilers_intro, programming_languages).

prerequisite(mechanics2, mechanics1).
prerequisite(probability_computer_apps, mechanics2).
prerequisite(statistical_methods, probability_computer_apps).
prerequisite(discrete_structures, statistical_methods).
prerequisite(data_structures_algorithms, data_structures1).
prerequisite(computer_networks, data_structures_algorithms).
prerequisite(embedded_control_systems, computer_networks).
prerequisite(parallel_distributed, embedded_control_systems).

prerequisite(physics2, physics1).
prerequisite(programming1, physics1).
prerequisite(data_structures1, programming1).
prerequisite(programming2, data_structures1).
prerequisite(programming_languages, programming2).
prerequisite(software_engineering, programming_languages).
prerequisite(computer_architecture, software_engineering).


% ECE
course(ece_math1, easy, electronics_and_communications).
course(ece_math2, easy, electronics_and_communications).
course(electric_circuits1, medium, electronics_and_communications).
course(electric_electronic_meas, medium, electronics_and_communications).
course(electric_circuits2, medium, electronics_and_communications).
course(computational_mathematics, medium, electronics_and_communications).
course(analog_communications, hard, electronics_and_communications).
course(analog_ic, hard, electronics_and_communications).
course(antenna, hard, electronics_and_communications).
course(networks_ece, hard, electronics_and_communications).

course(ece_mechanics1, easy, electronics_and_communications).
course(ece_mechanics2, easy, electronics_and_communications).
course(information_transmission, medium, electronics_and_communications).
course(electronics1, medium, electronics_and_communications).
course(electromagnetic_fields, medium, electronics_and_communications).
course(power_systems, medium, electronics_and_communications).
course(electromagnetic_waves, hard, electronics_and_communications).
course(transmission_media, hard, electronics_and_communications).
course(automatic_control, hard, electronics_and_communications).

course(ece_physics1, easy, electronics_and_communications).
course(ece_physics2, easy, electronics_and_communications).
course(energy_systems, medium, electronics_and_communications).
course(digital_logic_design, medium, electronics_and_communications).
course(solid_physics_devices, medium, electronics_and_communications).
course(electronics2, medium, electronics_and_communications).
course(digital_signal_processing, hard, electronics_and_communications).
course(digital_communications_intro, hard, electronics_and_communications).
course(digital_communications, hard, electronics_and_communications).

% Prerequisites - ECE
prerequisite(ece_math2, ece_math1).
prerequisite(electric_circuits1, ece_math2).
prerequisite(electric_electronic_meas, electric_circuits1).
prerequisite(electric_circuits2, electric_electronic_meas).
prerequisite(computational_mathematics, electric_circuits2).
prerequisite(analog_communications, computational_mathematics).
prerequisite(analog_ic, analog_communications).
prerequisite(antenna, analog_ic).

prerequisite(ece_mechanics2, ece_mechanics1).
prerequisite(information_transmission, ece_mechanics2).
prerequisite(electronics1, information_transmission).
prerequisite(electromagnetic_fields, electric_circuits2).
prerequisite(power_systems, electromagnetic_fields).
prerequisite(electromagnetic_waves, power_systems).
prerequisite(transmission_media, electromagnetic_waves).
prerequisite(automatic_control, transmission_media).

prerequisite(ece_physics2, ece_physics1).
prerequisite(energy_systems, ece_physics2).
prerequisite(digital_logic_design, energy_systems).
prerequisite(solid_physics_devices, digital_logic_design).
prerequisite(electronics2, solid_physics_devices).
prerequisite(digital_signal_processing, electronics2).
prerequisite(digital_communications_intro, digital_signal_processing).
prerequisite(digital_communications, digital_communications_intro).


% EPM
course(epm_math1, easy, electrical_power_and_machines).
course(epm_math2, easy, electrical_power_and_machines).
course(electric_circuits_epm, medium, electrical_power_and_machines).
course(electrical_electronic_meas, medium, electrical_power_and_machines).
course(advanced_electric_circuits, medium, electrical_power_and_machines).
course(power_transmission, hard, electrical_power_and_machines).
course(electrical_power_equipment, hard, electrical_power_and_machines).
course(energy_economics_safety, hard, electrical_power_and_machines).
course(power_network_analysis, hard, electrical_power_and_machines).
course(high_voltage, hard, electrical_power_and_machines).

course(epm_mechanics1, easy, electrical_power_and_machines).
course(epm_mechanics2, easy, electrical_power_and_machines).
course(info_transmission_epm, medium, electrical_power_and_machines).
course(electronic_devices_circuits, medium, electrical_power_and_machines).
course(microprocessors_epm, medium, electrical_power_and_machines).
course(dc_machines_transformers, medium, electrical_power_and_machines).
course(synchronous_machines, hard, electrical_power_and_machines).
course(induction_machines, hard, electrical_power_and_machines).
course(industrial_automation, hard, electrical_power_and_machines).

course(epm_physics1, easy, electrical_power_and_machines).
course(epm_physics2, easy, electrical_power_and_machines).
course(power_systems_intro, medium, electrical_power_and_machines).
course(logic_circuits_programming, medium, electrical_power_and_machines).
course(mechanical_thermal_design, medium, electrical_power_and_machines).
course(electronics_communications, medium, electrical_power_and_machines).
course(power_electronics1, hard, electrical_power_and_machines).
course(power_electronics2, hard, electrical_power_and_machines).
course(electric_drive, hard, electrical_power_and_machines).

% Prerequisites - EPM
prerequisite(epm_math2, epm_math1).
prerequisite(electric_circuits_epm, epm_math2).
prerequisite(electrical_electronic_meas, electric_circuits_epm).
prerequisite(advanced_electric_circuits, electrical_electronic_meas).
prerequisite(power_transmission, advanced_electric_circuits).
prerequisite(electrical_power_equipment, power_transmission).
prerequisite(energy_economics_safety, electrical_power_equipment).
prerequisite(power_network_analysis, energy_economics_safety).

prerequisite(epm_mechanics2, epm_mechanics1).
prerequisite(info_transmission_epm, epm_mechanics2).
prerequisite(electronic_devices_circuits, info_transmission_epm).
prerequisite(microprocessors_epm, electronic_devices_circuits).
prerequisite(dc_machines_transformers, microprocessors_epm).
prerequisite(synchronous_machines, dc_machines_transformers).
prerequisite(induction_machines, synchronous_machines).

prerequisite(epm_physics2, epm_physics1).
prerequisite(power_systems_intro, epm_physics2).
prerequisite(logic_circuits_programming, power_systems_intro).
prerequisite(mechanical_thermal_design, logic_circuits_programming).
prerequisite(electronics_communications, mechanical_thermal_design).
prerequisite(power_electronics1, electronics_communications).
prerequisite(power_electronics2, power_electronics1).
prerequisite(electric_drive, power_electronics2).


% CVE
course(cve_math1, easy, civil).
course(cve_math2, easy, civil).
course(multivariable_calculus, medium, civil).
course(numerical_methods_cve, medium, civil).

course(cve_mechanics1, easy, civil).
course(cve_mechanics2, easy, civil).
course(cve_mechanics3, medium, civil).

course(cve_physics1, easy, civil).
course(cve_physics2, easy, civil).

course(engineering_drawing1, easy, civil).
course(engineering_drawing2, easy, civil).
course(civil_drawing1, medium, civil).
course(civil_drawing2, medium, civil).

course(structural_analysis1, medium, civil).
course(structural_mechanics, medium, civil).
course(structural_analysis2, hard, civil).

course(material_properties1, medium, civil).
course(material_properties2, medium, civil).
course(reinforced_concrete_basics, hard, civil).

course(surveying_geomatics, medium, civil).
course(surveying_topography1, medium, civil).

course(hydraulics1, medium, civil).
course(hydraulics2, hard, civil).

% Prerequisites - CVE
prerequisite(cve_math2, cve_math1).
prerequisite(multivariable_calculus, cve_math2).
prerequisite(cve_mechanics2, cve_mechanics1).
prerequisite(cve_mechanics3, cve_mechanics2).
prerequisite(engineering_drawing2, engineering_drawing1).
prerequisite(civil_drawing1, engineering_drawing2).
prerequisite(civil_drawing2, civil_drawing1).
prerequisite(structural_analysis1, cve_mechanics1).
prerequisite(structural_mechanics, structural_analysis1).
prerequisite(structural_analysis2, structural_mechanics).
prerequisite(material_properties1, cve_physics1).
prerequisite(material_properties2, material_properties1).
prerequisite(reinforced_concrete_basics, material_properties2).
prerequisite(surveying_topography1, surveying_geomatics).
prerequisite(hydraulics2, hydraulics1).


% MEC
course(mec_math2, easy, mechanical).
course(mec_math3, medium, mechanical).
course(mec_math4_ode, medium, mechanical).
course(mec_mechanics3, medium, mechanical).
course(intro_thermal_eng, medium, mechanical).
course(thermodynamics1, medium, mechanical).
course(fluid_mechanics_basics, medium, mechanical).
course(material_mechanics, medium, mechanical).
course(machine_mechanics1, medium, mechanical).
course(machine_mechanics2, hard, mechanical).
course(strength_of_materials, hard, mechanical).
course(mechanical_drawing1, easy, mechanical).
course(mechanical_drawing2, medium, mechanical).
course(numerical_analysis_mec, medium, mechanical).
course(complex_analysis, hard, mechanical).

% Prerequisites - MEC
prerequisite(mec_math3, mec_math2).
prerequisite(mec_math4_ode, mec_math2).
prerequisite(intro_thermal_eng, mec_math2).
prerequisite(thermodynamics1, intro_thermal_eng).
prerequisite(material_mechanics, mec_math2).
prerequisite(machine_mechanics1, mec_math2).
prerequisite(machine_mechanics2, machine_mechanics1).
prerequisite(strength_of_materials, material_mechanics).
prerequisite(mechanical_drawing2, mechanical_drawing1).
prerequisite(mec_mechanics3, mec_math2).
prerequisite(fluid_mechanics_basics, mec_mechanics3).


% CHE
course(che_math1, easy, chemical).
course(che_math2, easy, chemical).
course(che_math3, medium, chemical).
course(che_math4, medium, chemical).
course(organic_chemistry1, medium, chemical).
course(organic_chemistry2, medium, chemical).
course(inorganic_chemistry, medium, chemical).
course(physical_chemistry1, medium, chemical).
course(physical_chemistry2, medium, chemical).
course(material_engineering, medium, chemical).
course(metallurgy, medium, chemical).
course(polymer_engineering, medium, chemical).
course(mass_balance, medium, chemical).
course(energy_balance, medium, chemical).
course(thermo1, medium, chemical).
course(thermo2, hard, chemical).
course(mass_transfer, hard, chemical).
course(separation1, hard, chemical).
course(separation2, hard, chemical).
course(separation3, hard, chemical).
course(fluid_engineering, hard, chemical).
course(heat_transfer, hard, chemical).
course(kinetics, hard, chemical).
course(modeling_simulation, hard, chemical).
course(corrosion_engineering, hard, chemical).
course(natural_gas, hard, chemical).
course(control_che, hard, chemical).
course(petroleum_refining, hard, chemical).
course(chemical_industry, hard, chemical).
course(chemical_design, hard, chemical).
course(instrument_analysis, medium, chemical).

% Prerequisites - CHE
prerequisite(che_math2, che_math1).
prerequisite(che_math3, che_math2).
prerequisite(che_math4, che_math3).
prerequisite(organic_chemistry2, organic_chemistry1).
prerequisite(physical_chemistry2, physical_chemistry1).
prerequisite(metallurgy, material_engineering).
prerequisite(mass_balance, organic_chemistry2).
prerequisite(energy_balance, mass_balance).
prerequisite(thermo1, che_math3).
prerequisite(thermo2, thermo1).
prerequisite(mass_transfer, thermo2).
prerequisite(separation1, mass_transfer).
prerequisite(separation2, separation1).
prerequisite(separation3, separation2).
prerequisite(polymer_engineering, physical_chemistry2).
prerequisite(fluid_engineering, polymer_engineering).
prerequisite(heat_transfer, fluid_engineering).
prerequisite(kinetics, heat_transfer).
prerequisite(modeling_simulation, kinetics).
prerequisite(control_che, modeling_simulation).
prerequisite(petroleum_refining, kinetics).
prerequisite(chemical_industry, control_che).
prerequisite(chemical_design, chemical_industry).


% PED
course(ped_math3, medium, production).
course(ped_mechanics3, medium, production).
course(ped_material1, medium, production).
course(design1, medium, production).
course(design2, medium, production).
course(design3, hard, production).
course(dimensional_metrology, medium, production).
course(probability_statistics_ped, medium, production).
course(solid_mechanics_ped, medium, production).
course(quality_control, hard, production).
course(vibration_machine_dynamics, hard, production).
course(plasticity_forming, hard, production).
course(ergonomics, medium, production).
course(machining_automation, hard, production).
course(production_planning, hard, production).
course(advanced_metrology, hard, production).
course(engineering_economics, medium, production).
course(project_management, medium, production).

% Prerequisites - PED
prerequisite(dimensional_metrology, ped_math3).
prerequisite(probability_statistics_ped, ped_math3).
prerequisite(solid_mechanics_ped, ped_mechanics3).
prerequisite(design1, ped_mechanics3).
prerequisite(design2, design1).
prerequisite(design3, design2).
prerequisite(quality_control, design3).
prerequisite(vibration_machine_dynamics, solid_mechanics_ped).
prerequisite(ergonomics, quality_control).
prerequisite(machining_automation, dimensional_metrology).
prerequisite(production_planning, machining_automation).
prerequisite(advanced_metrology, machining_automation).


% NAME: Naval Architecture and Marine Engineering 
course(name_math1, easy, naval_architecture).
course(name_math2, easy, naval_architecture).
course(name_math3, medium, naval_architecture).
course(name_math4, medium, naval_architecture).
course(name_mechanics1, easy, naval_architecture).
course(name_mechanics2, easy, naval_architecture).
course(name_mechanics3, medium, naval_architecture).
course(engineering_materials, medium, naval_architecture).
course(ship_drawing1, easy, naval_architecture).
course(ship_drawing2, medium, naval_architecture).
course(marine_structures1, medium, naval_architecture).
course(ship_construction, medium, naval_architecture).
course(machine_mechanics_name, medium, naval_architecture).
course(fluid_mechanics_name, medium, naval_architecture).
course(thermodynamics_name, medium, naval_architecture).
course(power_stations, medium, naval_architecture).
course(numerical_methods_name, medium, naval_architecture).
course(marine_electrical, medium, naval_architecture).
course(naval_architecture1, medium, naval_architecture).
course(hydrodynamics_marine1, hard, naval_architecture).
course(marine_structures2, hard, naval_architecture).
course(ship_design1, hard, naval_architecture).
course(naval_architecture2, hard, naval_architecture).
course(hydrodynamics_marine2, hard, naval_architecture).
course(ship_design2, hard, naval_architecture).
course(marine_dynamics, hard, naval_architecture).
course(combustion_engines, hard, naval_architecture).
course(marine_engineering, hard, naval_architecture).

% Prerequisites - NAME
prerequisite(name_math2, name_math1).
prerequisite(name_math3, name_math2).
prerequisite(name_math4, name_math3).
prerequisite(name_mechanics2, name_mechanics1).
prerequisite(name_mechanics3, name_mechanics2).
prerequisite(ship_drawing2, ship_drawing1).
prerequisite(marine_structures1, name_mechanics3).
prerequisite(machine_mechanics_name, name_mechanics3).
prerequisite(fluid_mechanics_name, name_mechanics3).
prerequisite(naval_architecture1, ship_drawing2).
prerequisite(hydrodynamics_marine1, naval_architecture1).
prerequisite(marine_structures2, marine_structures1).
prerequisite(ship_design1, naval_architecture1).
prerequisite(naval_architecture2, hydrodynamics_marine1).
prerequisite(hydrodynamics_marine2, naval_architecture2).
prerequisite(ship_design2, ship_design1).
prerequisite(marine_dynamics, hydrodynamics_marine2).
prerequisite(combustion_engines, thermodynamics_name).
prerequisite(marine_engineering, marine_structures2).


% NRED
course(nre_math1, easy, nuclear_and_radiation).
course(nre_math2, easy, nuclear_and_radiation).
course(nre_math3, medium, nuclear_and_radiation).
course(nre_math4, medium, nuclear_and_radiation).
course(nre_mechanics1, easy, nuclear_and_radiation).
course(nre_mechanics2, easy, nuclear_and_radiation).
course(nre_mechanics3, medium, nuclear_and_radiation).
course(nre_physics1, easy, nuclear_and_radiation).
course(nre_physics2, easy, nuclear_and_radiation).
course(nuclear_engineering_intro, medium, nuclear_and_radiation).
course(nuclear_materials, medium, nuclear_and_radiation).
course(nuclear_physics, medium, nuclear_and_radiation).
course(applied_thermodynamics_nre, medium, nuclear_and_radiation).
course(electronics_basics_nre, medium, nuclear_and_radiation).
course(nuclear_reactor_physics, hard, nuclear_and_radiation).
course(nuclear_reactions_analysis, hard, nuclear_and_radiation).
course(nuclear_heat_transfer, hard, nuclear_and_radiation).
course(radiation_protection, hard, nuclear_and_radiation).
course(nuclear_reactor_theory, hard, nuclear_and_radiation).
course(nuclear_safety, hard, nuclear_and_radiation).
course(nuclear_kinetics, hard, nuclear_and_radiation).
course(nuclear_fuel_cycles, hard, nuclear_and_radiation).
course(nuclear_hydroulics, hard, nuclear_and_radiation).

% Prerequisites - NRED
prerequisite(nre_math2, nre_math1).
prerequisite(nre_math3, nre_math2).
prerequisite(nre_math4, nre_math3).
prerequisite(nre_mechanics2, nre_mechanics1).
prerequisite(nre_mechanics3, nre_mechanics2).
prerequisite(nuclear_engineering_intro, nre_math3).
prerequisite(nuclear_physics, nuclear_engineering_intro).
prerequisite(applied_thermodynamics_nre, nre_mechanics3).
prerequisite(nuclear_reactor_physics, nuclear_physics).
prerequisite(nuclear_reactions_analysis, nuclear_reactor_physics).
prerequisite(nuclear_heat_transfer, applied_thermodynamics_nre).
prerequisite(radiation_protection, nuclear_reactions_analysis).
prerequisite(nuclear_reactor_theory, nuclear_reactor_physics).
prerequisite(nuclear_safety, radiation_protection).
prerequisite(nuclear_kinetics, nuclear_reactor_theory).
prerequisite(nuclear_fuel_cycles, nuclear_kinetics).
prerequisite(nuclear_hydroulics, nuclear_heat_transfer).


% ARC
course(arc_math1, easy, architectural).
course(arc_math2, easy, architectural).
course(arc_mechanics1, easy, architectural).
course(arc_mechanics2, easy, architectural).
course(arc_drawing1, easy, architectural).
course(arc_drawing2, medium, architectural).
course(architectural_design1, medium, architectural).
course(architectural_design2, medium, architectural).
course(architectural_design3, medium, architectural).
course(architectural_design4, medium, architectural).
course(architectural_design5, hard, architectural).
course(architectural_design6, hard, architectural).
course(architectural_design7, hard, architectural).
course(building_construction1, medium, architectural).
course(building_construction2, medium, architectural).
course(building_construction3, medium, architectural).
course(arch_history1, easy, architectural).
course(arch_history2, medium, architectural).
course(arch_history3, medium, architectural).
course(arch_theories1, medium, architectural).
course(arch_theories2, medium, architectural).
course(arch_theories3, hard, architectural).
course(color_theory, easy, architectural).
course(environmental_studies, medium, architectural).
course(technical_systems1, medium, architectural).
course(technical_systems2, medium, architectural).
course(soil_mechanics_arc, medium, architectural).
course(urban_design, hard, architectural).
course(interior_design, hard, architectural).
course(executive_designs1, hard, architectural).
course(executive_designs2, hard, architectural).
course(executive_designs3, hard, architectural).

% Prerequisites - ARC
prerequisite(arc_math2, arc_math1).
prerequisite(arc_mechanics2, arc_mechanics1).
prerequisite(arc_drawing2, arc_drawing1).
prerequisite(architectural_design1, arc_math2).
prerequisite(architectural_design2, architectural_design1).
prerequisite(architectural_design3, architectural_design2).
prerequisite(architectural_design4, architectural_design3).
prerequisite(architectural_design5, architectural_design4).
prerequisite(architectural_design6, architectural_design5).
prerequisite(architectural_design7, architectural_design6).
prerequisite(building_construction1, arc_mechanics2).
prerequisite(building_construction2, building_construction1).
prerequisite(building_construction3, building_construction2).
prerequisite(arch_history2, arch_history1).
prerequisite(arch_history3, arch_history2).
prerequisite(arch_theories1, arch_history1).
prerequisite(arch_theories2, arch_theories1).
prerequisite(arch_theories3, arch_theories2).
prerequisite(environmental_studies, color_theory).
prerequisite(technical_systems1, building_construction1).
prerequisite(technical_systems2, technical_systems1).
prerequisite(executive_designs1, architectural_design4).
prerequisite(executive_designs2, executive_designs1).
prerequisite(executive_designs3, executive_designs2).
prerequisite(urban_design, arch_theories2).
prerequisite(interior_design, architectural_design5).


% TED
course(ted_math1, easy, textiles).
course(ted_math2, easy, textiles).
course(ted_mechanics1, easy, textiles).
course(ted_mechanics2, easy, textiles).
course(ted_mechanics3, medium, textiles).
course(ted_physics1, easy, textiles).
course(ted_physics2, easy, textiles).
course(fiber_raw_materials, medium, textiles).
course(material_properties_ted, medium, textiles).
course(spinning_technology1, medium, textiles).
course(spinning_technology2, hard, textiles).
course(long_fiber_spinning, hard, textiles).
course(weaving_technology1, medium, textiles).
course(weaving_technology2, hard, textiles).
course(continuous_fiber_production, hard, textiles).
course(tricot_technology1, hard, textiles).
course(tricot_structures, hard, textiles).
course(nonwoven_fabrics, hard, textiles).
course(textile_preparation, medium, textiles).
course(textile_applications_stats, medium, textiles).
course(design_theory_machines, medium, textiles).
course(machine_drawing_ted, medium, textiles).
course(thermal_dynamics_ted, medium, textiles).
course(fluid_mechanics_ted, medium, textiles).
course(numerical_methods_ted, medium, textiles).
course(electrical_circuits_ted, medium, textiles).
course(programming1_ted, easy, textiles).
course(garment_manufacturing, hard, textiles).
course(textile_machinery_control, hard, textiles).
course(textile_quality, hard, textiles).
course(fabric_evaluation, hard, textiles).

% Prerequisites - TED
prerequisite(ted_math2, ted_math1).
prerequisite(ted_mechanics2, ted_mechanics1).
prerequisite(ted_mechanics3, ted_mechanics2).
prerequisite(fiber_raw_materials, ted_math2).
prerequisite(spinning_technology1, fiber_raw_materials).
prerequisite(spinning_technology2, spinning_technology1).
prerequisite(long_fiber_spinning, spinning_technology2).
prerequisite(weaving_technology1, fiber_raw_materials).
prerequisite(weaving_technology2, weaving_technology1).
prerequisite(continuous_fiber_production, weaving_technology1).
prerequisite(tricot_technology1, weaving_technology1).
prerequisite(tricot_structures, tricot_technology1).
prerequisite(design_theory_machines, ted_mechanics3).
prerequisite(thermal_dynamics_ted, ted_mechanics3).
prerequisite(fluid_mechanics_ted, ted_mechanics3).
prerequisite(machine_drawing_ted, design_theory_machines).
prerequisite(textile_preparation, spinning_technology1).
prerequisite(textile_applications_stats, textile_preparation).
prerequisite(garment_manufacturing, weaving_technology2).
prerequisite(textile_machinery_control, design_theory_machines).
prerequisite(textile_quality, textile_applications_stats).
prerequisite(fabric_evaluation, textile_quality).


% Business
course(intro_accounting, easy, business).
course(intro_economics, easy, business).
course(business_math, easy, business).
course(intro_management, easy, business).
course(business_english, easy, business).
course(microeconomics, medium, business).
course(macroeconomics, medium, business).
course(financial_accounting, medium, business).
course(cost_accounting, medium, business).
course(statistics_business, medium, business).
course(business_law, medium, business).
course(marketing_principles, medium, business).
course(organizational_behavior, medium, business).
course(financial_management, hard, business).
course(investment_analysis, hard, business).
course(auditing, hard, business).
course(taxation, hard, business).
course(strategic_management, hard, business).
course(international_business, hard, business).
course(managerial_accounting, hard, business).
course(econometrics, hard, business).
course(portfolio_management, hard, business).
course(corporate_finance, hard, business).

% Prerequisites - Business
prerequisite(microeconomics, intro_economics).
prerequisite(macroeconomics, microeconomics).
prerequisite(financial_accounting, intro_accounting).
prerequisite(cost_accounting, financial_accounting).
prerequisite(managerial_accounting, cost_accounting).
prerequisite(auditing, financial_accounting).
prerequisite(taxation, financial_accounting).
prerequisite(statistics_business, business_math).
prerequisite(econometrics, statistics_business).
prerequisite(financial_management, financial_accounting).
prerequisite(investment_analysis, financial_management).
prerequisite(portfolio_management, investment_analysis).
prerequisite(corporate_finance, financial_management).
prerequisite(strategic_management, organizational_behavior).
prerequisite(international_business, macroeconomics).
prerequisite(marketing_principles, intro_management).


% Medicine
course(med_anatomy1, easy, medicine).
course(med_physiology1, easy, medicine).
course(med_biochemistry1, easy, medicine).
course(med_histology1, easy, medicine).
course(med_anatomy2, medium, medicine).
course(med_physiology2, medium, medicine).
course(med_biochemistry2, medium, medicine).
course(med_histology2, medium, medicine).
course(med_microbiology, medium, medicine).
course(med_pathology1, medium, medicine).
course(med_pharmacology1, medium, medicine).
course(med_genetics, medium, medicine).
course(med_immunology, medium, medicine).
course(med_pathology2, hard, medicine).
course(med_pharmacology2, hard, medicine).
course(internal_medicine, hard, medicine).
course(surgery1, hard, medicine).
course(surgery2, hard, medicine).
course(pediatrics, hard, medicine).
course(obstetrics_gynecology, hard, medicine).
course(psychiatry, hard, medicine).
course(ophthalmology, hard, medicine).
course(orthopedics, hard, medicine).
course(radiology, hard, medicine).
course(forensic_medicine, hard, medicine).
course(community_medicine, medium, medicine).

% Prerequisites - Medicine
prerequisite(med_anatomy2, med_anatomy1).
prerequisite(med_physiology2, med_physiology1).
prerequisite(med_biochemistry2, med_biochemistry1).
prerequisite(med_histology2, med_histology1).
prerequisite(med_pathology1, med_physiology2).
prerequisite(med_pathology1, med_biochemistry2).
prerequisite(med_pharmacology1, med_physiology2).
prerequisite(med_pharmacology1, med_biochemistry2).
prerequisite(med_immunology, med_microbiology).
prerequisite(med_pathology2, med_pathology1).
prerequisite(med_pharmacology2, med_pharmacology1).
prerequisite(internal_medicine, med_pathology2).
prerequisite(internal_medicine, med_pharmacology2).
prerequisite(surgery1, med_anatomy2).
prerequisite(surgery1, med_pathology2).
prerequisite(surgery2, surgery1).
prerequisite(pediatrics, internal_medicine).
prerequisite(obstetrics_gynecology, internal_medicine).
prerequisite(psychiatry, internal_medicine).
prerequisite(ophthalmology, surgery1).
prerequisite(orthopedics, surgery1).
prerequisite(radiology, internal_medicine).
prerequisite(forensic_medicine, med_pathology2).


% Dentistry
course(dent_anatomy, easy, dentistry).
course(dent_physiology, easy, dentistry).
course(dent_biochemistry, easy, dentistry).
course(dent_histology, easy, dentistry).
course(dent_microbiology, medium, dentistry).
course(dent_pathology, medium, dentistry).
course(dent_pharmacology, medium, dentistry).
course(dental_materials1, medium, dentistry).
course(dental_materials2, medium, dentistry).
course(oral_anatomy, medium, dentistry).
course(oral_physiology, medium, dentistry).
course(oral_radiology, medium, dentistry).
course(conservative_dentistry1, medium, dentistry).
course(conservative_dentistry2, hard, dentistry).
course(oral_surgery1, hard, dentistry).
course(oral_surgery2, hard, dentistry).
course(prosthodontics1, hard, dentistry).
course(prosthodontics2, hard, dentistry).
course(orthodontics, hard, dentistry).
course(periodontics, hard, dentistry).
course(pedodontics, hard, dentistry).
course(oral_medicine, hard, dentistry).

% Prerequisites - Dentistry
prerequisite(dent_pathology, dent_physiology).
prerequisite(dent_pathology, dent_biochemistry).
prerequisite(dent_pharmacology, dent_physiology).
prerequisite(dental_materials2, dental_materials1).
prerequisite(oral_physiology, dent_physiology).
prerequisite(oral_anatomy, dent_anatomy).
prerequisite(oral_radiology, oral_anatomy).
prerequisite(conservative_dentistry1, dental_materials1).
prerequisite(conservative_dentistry1, oral_anatomy).
prerequisite(conservative_dentistry2, conservative_dentistry1).
prerequisite(oral_surgery1, dent_anatomy).
prerequisite(oral_surgery1, dent_pharmacology).
prerequisite(oral_surgery2, oral_surgery1).
prerequisite(prosthodontics1, dental_materials2).
prerequisite(prosthodontics2, prosthodontics1).
prerequisite(orthodontics, oral_anatomy).
prerequisite(periodontics, dent_pathology).
prerequisite(pedodontics, conservative_dentistry2).
prerequisite(oral_medicine, dent_pathology).
prerequisite(oral_medicine, dent_pharmacology).


% Law
course(intro_law, easy, law).
course(arabic_language_law, easy, law).
course(islamic_jurisprudence, easy, law).
course(legal_english, easy, law).
course(civil_law1, medium, law).
course(civil_law2, medium, law).
course(criminal_law1, medium, law).
course(criminal_law2, medium, law).
course(constitutional_law, medium, law).
course(administrative_law, medium, law).
course(commercial_law1, medium, law).
course(commercial_law2, medium, law).
course(international_law, medium, law).
course(labor_law, medium, law).
course(civil_procedure1, hard, law).
course(civil_procedure2, hard, law).
course(criminal_procedure, hard, law).
course(private_international_law, hard, law).
course(tax_law, hard, law).
course(maritime_law, hard, law).
course(intellectual_property_law, hard, law).

% Prerequisites - Law
prerequisite(civil_law2, civil_law1).
prerequisite(criminal_law2, criminal_law1).
prerequisite(commercial_law2, commercial_law1).
prerequisite(civil_procedure1, civil_law2).
prerequisite(civil_procedure2, civil_procedure1).
prerequisite(criminal_procedure, criminal_law2).
prerequisite(administrative_law, constitutional_law).
prerequisite(private_international_law, international_law).
prerequisite(tax_law, administrative_law).
prerequisite(maritime_law, commercial_law2).
prerequisite(labor_law, civil_law2).
prerequisite(intellectual_property_law, commercial_law2).


% Agriculture and Life Sciences
course(agri_botany, easy, agriculture).
course(agri_zoology, easy, agriculture).
course(agri_chemistry, easy, agriculture).
course(agri_math, easy, agriculture).
course(agri_physics, easy, agriculture).
course(agri_biochemistry, medium, agriculture).
course(agri_microbiology, medium, agriculture).
course(soil_science, medium, agriculture).
course(plant_physiology, medium, agriculture).
course(genetics_agri, medium, agriculture).
course(crop_science, medium, agriculture).
course(animal_production, medium, agriculture).
course(agri_economics, medium, agriculture).
course(agri_engineering_basics, medium, agriculture).
course(plant_pathology, hard, agriculture).
course(plant_breeding, hard, agriculture).
course(agricultural_biotechnology, hard, agriculture).
course(irrigation_drainage, hard, agriculture).
course(food_science, hard, agriculture).
course(pest_management, hard, agriculture).
course(agri_machinery, hard, agriculture).
course(agri_planning_development, hard, agriculture).
course(aquaculture, hard, agriculture).

% Prerequisites - Agriculture
prerequisite(agri_biochemistry, agri_chemistry).
prerequisite(agri_microbiology, agri_biochemistry).
prerequisite(soil_science, agri_chemistry).
prerequisite(plant_physiology, agri_botany).
prerequisite(plant_physiology, agri_biochemistry).
prerequisite(genetics_agri, agri_botany).
prerequisite(genetics_agri, agri_zoology).
prerequisite(crop_science, plant_physiology).
prerequisite(animal_production, agri_zoology).
prerequisite(plant_pathology, agri_microbiology).
prerequisite(plant_pathology, plant_physiology).
prerequisite(plant_breeding, genetics_agri).
prerequisite(agricultural_biotechnology, genetics_agri).
prerequisite(agricultural_biotechnology, agri_microbiology).
prerequisite(food_science, agri_biochemistry).
prerequisite(pest_management, plant_pathology).
prerequisite(irrigation_drainage, soil_science).
prerequisite(aquaculture, animal_production).


% Fine Arts
course(art_history1, easy, fine_arts).
course(art_history2, medium, fine_arts).
course(art_history3, hard, fine_arts).
course(drawing_basics, easy, fine_arts).
course(drawing_advanced, medium, fine_arts).
course(color_theory_art, easy, fine_arts).
course(painting1, easy, fine_arts).
course(painting2, medium, fine_arts).
course(painting3, hard, fine_arts).
course(sculpture1, easy, fine_arts).
course(sculpture2, medium, fine_arts).
course(sculpture3, hard, fine_arts).
course(graphic_design1, medium, fine_arts).
course(graphic_design2, hard, fine_arts).
course(printmaking1, medium, fine_arts).
course(printmaking2, hard, fine_arts).
course(photography, medium, fine_arts).
course(digital_art, medium, fine_arts).
course(interior_design_art, hard, fine_arts).
course(ceramics, medium, fine_arts).
course(art_criticism, hard, fine_arts).
course(graduation_project_art, hard, fine_arts).

% Prerequisites - Fine Arts
prerequisite(art_history2, art_history1).
prerequisite(art_history3, art_history2).
prerequisite(drawing_advanced, drawing_basics).
prerequisite(painting1, drawing_basics).
prerequisite(painting1, color_theory_art).
prerequisite(painting2, painting1).
prerequisite(painting3, painting2).
prerequisite(sculpture2, sculpture1).
prerequisite(sculpture3, sculpture2).
prerequisite(graphic_design1, drawing_basics).
prerequisite(graphic_design2, graphic_design1).
prerequisite(printmaking2, printmaking1).
prerequisite(digital_art, graphic_design1).
prerequisite(interior_design_art, drawing_advanced).
prerequisite(art_criticism, art_history2).
prerequisite(graduation_project_art, painting3).


% Science
course(sci_math1, easy, science).
course(sci_math2, medium, science).
course(sci_physics1, easy, science).
course(sci_physics2, medium, science).
course(sci_chemistry1, easy, science).
course(sci_chemistry2, medium, science).
course(sci_biology1, easy, science).
course(sci_biology2, medium, science).
course(calculus, medium, science).
course(linear_algebra_sci, medium, science).
course(organic_chemistry_sci, medium, science).
course(analytical_chemistry, medium, science).
course(physical_chemistry_sci, hard, science).
course(quantum_mechanics, hard, science).
course(thermodynamics_sci, hard, science).
course(molecular_biology, hard, science).
course(marine_sciences, hard, science).
course(environmental_sciences, hard, science).
course(biochemistry_sci, hard, science).
course(genetics_sci, hard, science).
course(spectroscopy, hard, science).
course(nuclear_physics_sci, hard, science).

% Prerequisites - Science
prerequisite(sci_math2, sci_math1).
prerequisite(sci_physics2, sci_physics1).
prerequisite(sci_chemistry2, sci_chemistry1).
prerequisite(sci_biology2, sci_biology1).
prerequisite(calculus, sci_math2).
prerequisite(organic_chemistry_sci, sci_chemistry2).
prerequisite(analytical_chemistry, sci_chemistry2).
prerequisite(physical_chemistry_sci, sci_chemistry2).
prerequisite(physical_chemistry_sci, sci_physics2).
prerequisite(quantum_mechanics, sci_physics2).
prerequisite(quantum_mechanics, calculus).
prerequisite(thermodynamics_sci, sci_physics2).
prerequisite(molecular_biology, sci_biology2).
prerequisite(biochemistry_sci, organic_chemistry_sci).
prerequisite(genetics_sci, molecular_biology).
prerequisite(marine_sciences, sci_biology2).
prerequisite(environmental_sciences, sci_biology2).
prerequisite(spectroscopy, analytical_chemistry).
prerequisite(nuclear_physics_sci, quantum_mechanics).


% Pharmacy
course(pharm_chemistry1, easy, pharmacy).
course(pharm_biochemistry1, easy, pharmacy).
course(pharm_botany, easy, pharmacy).
course(pharm_anatomy_physiology, easy, pharmacy).
course(pharm_chemistry2, medium, pharmacy).
course(pharm_biochemistry2, medium, pharmacy).
course(pharm_microbiology, medium, pharmacy).
course(pharm_organic_chemistry, medium, pharmacy).
course(pharmacognosy1, medium, pharmacy).
course(pharmacognosy2, hard, pharmacy).
course(pharmaceutics1, medium, pharmacy).
course(pharmaceutics2, hard, pharmacy).
course(pharmacology1, medium, pharmacy).
course(pharmacology2, hard, pharmacy).
course(pharmaceutical_analysis, hard, pharmacy).
course(clinical_pharmacy, hard, pharmacy).
course(toxicology, hard, pharmacy).
course(pharmaceutical_technology, hard, pharmacy).
course(drug_design, hard, pharmacy).
course(pharmacy_management, medium, pharmacy).

% Prerequisites - Pharmacy
prerequisite(pharm_chemistry2, pharm_chemistry1).
prerequisite(pharm_biochemistry2, pharm_biochemistry1).
prerequisite(pharm_organic_chemistry, pharm_chemistry2).
prerequisite(pharmacognosy1, pharm_botany).
prerequisite(pharmacognosy2, pharmacognosy1).
prerequisite(pharmaceutics1, pharm_chemistry2).
prerequisite(pharmaceutics2, pharmaceutics1).
prerequisite(pharmacology1, pharm_anatomy_physiology).
prerequisite(pharmacology1, pharm_biochemistry2).
prerequisite(pharmacology2, pharmacology1).
prerequisite(pharmaceutical_analysis, pharm_organic_chemistry).
prerequisite(pharmaceutical_analysis, pharm_chemistry2).
prerequisite(clinical_pharmacy, pharmacology2).
prerequisite(toxicology, pharmacology2).
prerequisite(pharmaceutical_technology, pharmaceutics2).
prerequisite(drug_design, pharm_organic_chemistry).
prerequisite(drug_design, pharmacology2).


% Nursing
course(nursing_anatomy, easy, nursing).
course(nursing_physiology, easy, nursing).
course(nursing_biochemistry, easy, nursing).
course(nursing_microbiology, easy, nursing).
course(nursing_fundamentals, easy, nursing).
course(nursing_pharmacology, medium, nursing).
course(nursing_nutrition, medium, nursing).
course(medical_surgical_nursing1, medium, nursing).
course(medical_surgical_nursing2, hard, nursing).
course(pediatric_nursing, hard, nursing).
course(maternity_nursing, hard, nursing).
course(psychiatric_nursing, hard, nursing).
course(community_nursing, medium, nursing).
course(critical_care_nursing, hard, nursing).
course(nursing_management, medium, nursing).
course(nursing_research, hard, nursing).

% Prerequisites - Nursing
prerequisite(nursing_pharmacology, nursing_physiology).
prerequisite(nursing_pharmacology, nursing_biochemistry).
prerequisite(medical_surgical_nursing1, nursing_fundamentals).
prerequisite(medical_surgical_nursing1, nursing_pharmacology).
prerequisite(medical_surgical_nursing2, medical_surgical_nursing1).
prerequisite(pediatric_nursing, medical_surgical_nursing2).
prerequisite(maternity_nursing, medical_surgical_nursing2).
prerequisite(psychiatric_nursing, medical_surgical_nursing1).
prerequisite(critical_care_nursing, medical_surgical_nursing2).
prerequisite(community_nursing, nursing_fundamentals).
prerequisite(nursing_research, medical_surgical_nursing2).


% Veterinary Medicine
course(vet_anatomy1, easy, veterinary).
course(vet_histology, easy, veterinary).
course(vet_biochemistry, easy, veterinary).
course(vet_physiology, easy, veterinary).
course(vet_anatomy2, medium, veterinary).
course(vet_microbiology, medium, veterinary).
course(vet_parasitology, medium, veterinary).
course(vet_pharmacology1, medium, veterinary).
course(vet_pathology1, medium, veterinary).
course(vet_nutrition, medium, veterinary).
course(vet_pharmacology2, hard, veterinary).
course(vet_pathology2, hard, veterinary).
course(vet_surgery1, hard, veterinary).
course(vet_surgery2, hard, veterinary).
course(vet_medicine_internal, hard, veterinary).
course(vet_infectious_diseases, hard, veterinary).
course(food_hygiene, hard, veterinary).
course(vet_reproduction, hard, veterinary).
course(vet_forensic, hard, veterinary).
course(animal_production_vet, medium, veterinary).

% Prerequisites - Veterinary
prerequisite(vet_anatomy2, vet_anatomy1).
prerequisite(vet_physiology, vet_anatomy1).
prerequisite(vet_pathology1, vet_physiology).
prerequisite(vet_pathology1, vet_biochemistry).
prerequisite(vet_pharmacology1, vet_physiology).
prerequisite(vet_pharmacology2, vet_pharmacology1).
prerequisite(vet_pathology2, vet_pathology1).
prerequisite(vet_surgery1, vet_anatomy2).
prerequisite(vet_surgery1, vet_pharmacology2).
prerequisite(vet_surgery2, vet_surgery1).
prerequisite(vet_medicine_internal, vet_pathology2).
prerequisite(vet_medicine_internal, vet_pharmacology2).
prerequisite(vet_infectious_diseases, vet_microbiology).
prerequisite(vet_infectious_diseases, vet_pathology2).
prerequisite(food_hygiene, vet_microbiology).
prerequisite(vet_reproduction, vet_physiology).
prerequisite(vet_forensic, vet_pathology2).


% Tourism and Hotels
course(intro_tourism, easy, tourism).
course(tourism_english, easy, tourism).
course(tourism_geography, easy, tourism).
course(egyptian_history, easy, tourism).
course(tourism_economics, medium, tourism).
course(hotel_management_basics, easy, tourism).
course(food_beverage_management, medium, tourism).
course(housekeeping_management, medium, tourism).
course(front_office_management, medium, tourism).
course(tourism_law, medium, tourism).
course(heritage_tourism, medium, tourism).
course(eco_tourism, medium, tourism).
course(event_management, hard, tourism).
course(hotel_accounting, medium, tourism).
course(strategic_tourism_management, hard, tourism).
course(tourism_marketing, hard, tourism).
course(cultural_tourism, hard, tourism).
course(tourism_research, hard, tourism).

% Prerequisites - Tourism
prerequisite(tourism_economics, intro_tourism).
prerequisite(heritage_tourism, egyptian_history).
prerequisite(food_beverage_management, hotel_management_basics).
prerequisite(housekeeping_management, hotel_management_basics).
prerequisite(front_office_management, hotel_management_basics).
prerequisite(event_management, front_office_management).
prerequisite(strategic_tourism_management, tourism_economics).
prerequisite(tourism_marketing, tourism_economics).
prerequisite(cultural_tourism, heritage_tourism).
prerequisite(tourism_research, strategic_tourism_management).
prerequisite(eco_tourism, tourism_geography).

% Education
course(edu_psychology, easy, education).
course(edu_philosophy, easy, education).
course(edu_sociology, easy, education).
course(teaching_methods_general, easy, education).
course(curriculum_design, medium, education).
course(educational_measurement, medium, education).
course(child_development, medium, education).
course(teaching_methods_science, medium, education).
course(teaching_methods_math, medium, education).
course(educational_technology, medium, education).
course(special_education, medium, education).
course(classroom_management, medium, education).
course(educational_research, hard, education).
course(educational_administration, hard, education).
course(comparative_education, hard, education).
course(counseling_guidance, hard, education).

% Prerequisites - Education
prerequisite(curriculum_design, teaching_methods_general).
prerequisite(educational_measurement, edu_psychology).
prerequisite(child_development, edu_psychology).
prerequisite(teaching_methods_science, teaching_methods_general).
prerequisite(teaching_methods_math, teaching_methods_general).
prerequisite(educational_technology, curriculum_design).
prerequisite(special_education, child_development).
prerequisite(classroom_management, edu_psychology).
prerequisite(educational_research, educational_measurement).
prerequisite(educational_administration, edu_sociology).
prerequisite(comparative_education, edu_philosophy).
prerequisite(counseling_guidance, edu_psychology).


% Physical Education
course(anatomy_phys_ed, easy, physical_education).
course(physiology_phys_ed, easy, physical_education).
course(sports_history, easy, physical_education).
course(sports_psychology, medium, physical_education).
course(biomechanics, medium, physical_education).
course(sports_nutrition, medium, physical_education).
course(track_field, easy, physical_education).
course(swimming, easy, physical_education).
course(team_sports, easy, physical_education).
course(gymnastics, medium, physical_education).
course(sports_medicine, hard, physical_education).
course(sports_training_theory, medium, physical_education).
course(sports_management, hard, physical_education).
course(physical_therapy_basics, hard, physical_education).
course(sports_research, hard, physical_education).

% Prerequisites - Physical Education
prerequisite(physiology_phys_ed, anatomy_phys_ed).
prerequisite(sports_psychology, physiology_phys_ed).
prerequisite(biomechanics, physiology_phys_ed).
prerequisite(sports_nutrition, physiology_phys_ed).
prerequisite(sports_medicine, biomechanics).
prerequisite(sports_medicine, sports_nutrition).
prerequisite(sports_training_theory, sports_psychology).
prerequisite(sports_management, sports_training_theory).
prerequisite(physical_therapy_basics, sports_medicine).
prerequisite(sports_research, sports_training_theory).



% Recommend a course that has a prerequisite
recommend(Student, Course) :-
    course(Course, Difficulty, Dept),
    student_preference(Student, Dept),
    prefers_difficulty(Student, Difficulty),
    not(completed(Student, Course)),
    prerequisite(Course, Pre),
    completed(Student, Pre).

% For courses with NO prerequisites
recommend(Student, Course) :-
    course(Course, Difficulty, Dept),
    student_preference(Student, Dept),
    prefers_difficulty(Student, Difficulty),
    not(completed(Student, Course)),
    not(prerequisite(Course, _)).
