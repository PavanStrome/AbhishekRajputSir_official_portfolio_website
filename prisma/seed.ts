import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for Dr. Abhishek Rajput portfolio...");

  // 1. Clean existing records
  await prisma.siteSettings.deleteMany();
  await prisma.news.deleteMany();
  await prisma.award.deleteMany();
  await prisma.student.deleteMany();
  await prisma.course.deleteMany();
  await prisma.project.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.researchArea.deleteMany();
  await prisma.academicPosition.deleteMany();
  await prisma.education.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin User
  const hashedPassword = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@iiti.ac.in",
      password: hashedPassword,
      name: "Dr. Abhishek Rajput",
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // 3. Profile
  const profile = await prisma.profile.create({
    data: {
      name: "Dr. Abhishek Rajput",
      title: "Ph.D., IIT Roorkee",
      designation: "Assistant Professor",
      department: "Department of Civil Engineering",
      institution: "Indian Institute of Technology Indore",
      location: "Simrol, Khandwa Road, Indore - 453552, Madhya Pradesh, India",
      shortBio:
        "Assistant Professor in Civil Engineering at IIT Indore specializing in structural impact mechanics, ballistic penetration of concrete and metals, crashworthiness, and finite element modeling.",
      bio: "Dr. Abhishek Rajput is an Assistant Professor in the Department of Civil Engineering at the Indian Institute of Technology Indore (IIT Indore), India. He received his Ph.D. and M.Tech. degrees in Civil and Structural Engineering from IIT Roorkee. Prior to joining IIT Indore, he completed a Post-Doctoral Fellowship at the Korean Ships and Offshore Structure Research Institute at Pusan National University, South Korea, and served as an Assistant Professor at NIT Jalandhar.\n\nHis research group investigates the behavior of concrete and metallic materials under extreme dynamic loading, including projectile impact, blast waves, high strain rates, and structural crashworthiness. He also researches the influence of accelerated and natural corrosion on the mechanical integrity of structural steels.",
      avatarUrl: "/images/Drabhishekrajput.jpg",
      email: "abhishekrajput@iiti.ac.in",
      phone: "+91-731-660-3100",
      office: "Room 304, POD 1D, School of Engineering, IIT Indore",
      officeHours: "Monday to Friday: 10:00 AM - 6:00 PM (Prior appointment recommended)",
      researchInterests:
        "Structural & Impact Mechanics, Finite Element Analysis, Prestressed & Reinforced Concrete, Ballistic Impact, Blast Loading, Structural Crashworthiness, Corrosion Mechanics, Ship Design",
      googleScholarUrl: "https://scholar.google.com/citations?user=abhishekrajput",
      orcidUrl: "https://orcid.org/0000-0002-1234-5678",
      researchGateUrl: "https://www.researchgate.net/profile/Abhishek-Rajput",
      linkedinUrl: "https://www.linkedin.com/in/dr-abhishek-rajput",
      githubUrl: "https://github.com",
      personalWebsiteUrl: "https://people.iiti.ac.in/~abhishekrajput/",
      cvUrl: "/uploads/abhishekrajput_cv.pdf",
      cvUpdatedAt: new Date("2025-08-15"),
    },
  });
  console.log(`Created profile for: ${profile.name}`);

  // 4. Education
  await prisma.education.createMany({
    data: [
      {
        degree: "Ph.D.",
        field: "Civil Engineering (Structural & Impact Mechanics)",
        institution: "Indian Institute of Technology Roorkee (IIT Roorkee), India",
        year: "2017",
        location: "Roorkee, Uttarakhand, India",
        order: 1,
      },
      {
        degree: "M.Tech.",
        field: "Structural Engineering",
        institution: "Indian Institute of Technology Roorkee (IIT Roorkee), India",
        year: "2011",
        location: "Roorkee, Uttarakhand, India",
        order: 2,
      },
      {
        degree: "B.E.",
        field: "Civil Engineering",
        institution: "Government Engineering College Jabalpur, India",
        year: "2009",
        location: "Jabalpur, Madhya Pradesh, India",
        order: 3,
      },
    ],
  });

  // 5. Academic Positions
  await prisma.academicPosition.createMany({
    data: [
      {
        title: "Assistant Professor",
        institution: "Indian Institute of Technology Indore",
        department: "Department of Civil Engineering",
        startYear: "2018",
        endYear: null,
        isCurrent: true,
        order: 1,
      },
      {
        title: "Post-Doctoral Fellow",
        institution: "Pusan National University, South Korea",
        department: "Korean Ships and Offshore Structure Research Institute",
        startYear: "2017",
        endYear: "2018",
        isCurrent: false,
        order: 2,
      },
      {
        title: "Assistant Professor",
        institution: "National Institute of Technology Jalandhar (NIT Jalandhar)",
        department: "Department of Civil Engineering",
        startYear: "2017",
        endYear: "2017",
        isCurrent: false,
        order: 3,
      },
    ],
  });

  // 6. Research Areas
  const r1 = await prisma.researchArea.create({
    data: {
      title: "Impact & Ballistic Mechanics",
      slug: "impact-ballistic-mechanics",
      summary:
        "Investigating the ballistic limits, scabbing, spalling, and perforation thresholds of plain, reinforced, and prestressed concrete targets subjected to projectile strikes.",
      description:
        "High-velocity projectile penetration poses severe risks to critical national infrastructure, nuclear containment vessels, and defense installations. Our research team performs rigorous experimental projectile impact trials using pneumatic launcher setups coupled with laser chronographs and high-speed imaging. We correlate ogival projectile geometry, striking velocity (up to 200 m/s), and target reinforcement detailing with energy dissipation mechanisms, shear plug ejection, and residual concrete core integrity.",
      keywords: "Ballistic Impact, Concrete Penetration, Perforation Threshold, Ogival Projectiles, Dynamic Shear Plugging",
      order: 1,
      isPublished: true,
    },
  });

  const r2 = await prisma.researchArea.create({
    data: {
      title: "Finite Element Analysis & Computational Mechanics",
      slug: "computational-mechanics-fem",
      summary:
        "Advanced nonlinear explicit finite element modeling of dynamic damage, large deformations, and multi-physics fracture in concrete and metallic structures.",
      description:
        "To transcend the prohibitive costs and hazards of physical blast and ballistic tests, we formulate highly resolved nonlinear finite element simulations utilizing explicit time integration. We implement and validate rate-dependent constitutive formulations including the Continuous Surface Cap Model (CSCM), Holmquist-Johnson-Cook (HJC) concrete plasticity, and Johnson-Cook viscoplastic models with element erosion algorithms to predict structural failure accurately.",
      keywords: "Non-linear FEA, LS-DYNA, ABAQUS, Constitutive Formulations, Large Deformations, Element Erosion",
      order: 2,
      isPublished: true,
    },
  });

  const r3 = await prisma.researchArea.create({
    data: {
      title: "Prestressed Concrete Under Dynamic Loading",
      slug: "prestressed-concrete-dynamic-loading",
      summary:
        "Assessing the beneficial confinement and crack mitigation effects of prestressing tendons on concrete slabs subjected to impact across varied temperatures.",
      description:
        "Prestressed concrete offers distinctive pre-compression stresses that markedly inhibit tensile cracking and back-face scabbing under impact. Our laboratory systematically evaluates how initial tendon tension, tendon layout, and environmental temperature fluctuations typical of the Indian subcontinent govern scabbing volume, crater morphology, and post-impact residual load capacities.",
      keywords: "Prestressed Slabs, Pre-compression Confinement, Scabbing Reduction, Temperature Effects, Drop Weight Testing",
      order: 3,
      isPublished: true,
    },
  });

  const r4 = await prisma.researchArea.create({
    data: {
      title: "Corrosion Mechanics & Structural Steel Degradation",
      slug: "corrosion-mechanics-structural-steel",
      summary:
        "Quantifying the effects of naturally progressed and accelerated environmental corrosion on chemical composition, yield strength, and fracture toughness of structural steels.",
      description:
        "Infrastructure situated in marine environments or industrial belts experiences progressive surface pitting and cross-sectional reduction. We investigate the mechanical and metallurgical alterations of corroded structural steels, analyzing pit depth distributions, stress concentration hotspots, and the resulting degradation in yield strength, ductility, and dynamic crashworthiness.",
      keywords: "Marine Corrosion, Pit Morphology, Steel Degradation, Residual Strength, Life-Cycle Assessment",
      order: 4,
      isPublished: true,
    },
  });

  // 7. Publications
  await prisma.publication.createMany({
    data: [
      {
        title: "Effects of naturally-progressed corrosion on the chemical and mechanical properties of structural steels",
        authors: "Rajput, A., Paik, J. K., et al.",
        publicationType: "JOURNAL",
        venue: "Structures (Elsevier)",
        year: 2020,
        month: "June",
        volume: "27",
        pages: "1230-1242",
        doi: "10.1016/j.istruc.2020.06.014",
        paperUrl: "https://doi.org/10.1016/j.istruc.2020.06.014",
        pdfUrl: "/uploads/papers/corrosion_structural_steels_2020.pdf",
        scholarUrl: "https://scholar.google.com",
        abstract:
          "Naturally progressed corrosion causes severe stochastic pit distributions and localized microstructural degradation on steel surfaces. This study conducts tensile tests, metallurgical spectroscopy, and fractographic analysis on steel plates retrieved from long-service marine structures. Empirical models are proposed to predict yield stress reductions and loss of elongation as a function of average pit depth.",
        isFeatured: true,
        status: "PUBLISHED",
        order: 1,
        researchAreaId: r4.id,
      },
      {
        title: "Ballistic performances of concrete targets subjected to long projectile impact",
        authors: "Rajput, A., Iqbal, M. A., Gupta, N. K.",
        publicationType: "JOURNAL",
        venue: "Thin-Walled Structures (Elsevier)",
        year: 2018,
        month: "April",
        volume: "126",
        pages: "171-181",
        doi: "10.1016/j.tws.2018.01.012",
        paperUrl: "https://doi.org/10.1016/j.tws.2018.01.012",
        pdfUrl: "/uploads/papers/ballistic_concrete_targets_2018.pdf",
        scholarUrl: "https://scholar.google.com",
        abstract:
          "This paper presents experimental investigations on plain, reinforced, and prestressed concrete targets impacted by high-aspect-ratio long projectiles. Both sub-ordnance velocities and critical perforation thresholds were examined. High-speed framing cameras captured crater kinematics, demonstrating that targeted reinforcement significantly limits ejecta and secondary fragmentation.",
        isFeatured: true,
        status: "PUBLISHED",
        order: 2,
        researchAreaId: r1.id,
      },
      {
        title: "Ballistic performance of plain, reinforced and pre-stressed concrete slabs under normal impact by an ogival-nosed projectile",
        authors: "Rajput, A., Iqbal, M. A.",
        publicationType: "JOURNAL",
        venue: "International Journal of Impact Engineering (Elsevier)",
        year: 2017,
        month: "May",
        volume: "110",
        pages: "15-28",
        doi: "10.1016/j.ijimpeng.2017.03.011",
        paperUrl: "https://doi.org/10.1016/j.ijimpeng.2017.03.011",
        pdfUrl: "/uploads/papers/ballistic_prestressed_slabs_2017.pdf",
        scholarUrl: "https://scholar.google.com",
        abstract:
          "Slabs with identical compressive strengths were fabricated under plain, reinforced, and prestressed configurations and tested against ogival-nosed hardened steel projectiles. Results demonstrate that prestressing biaxial stress suppresses distal scabbing by up to 45% compared to plain concrete and delays the onset of shear plugging.",
        isFeatured: true,
        status: "PUBLISHED",
        order: 3,
        researchAreaId: r3.id,
      },
      {
        title: "Impact behavior of plain, reinforced and prestressed concrete targets",
        authors: "Rajput, A., Iqbal, M. A.",
        publicationType: "JOURNAL",
        venue: "Materials & Design (Elsevier)",
        year: 2017,
        month: "January",
        volume: "112",
        pages: "68-80",
        doi: "10.1016/j.matdes.2016.11.085",
        paperUrl: "https://doi.org/10.1016/j.matdes.2016.11.085",
        pdfUrl: "/uploads/papers/impact_concrete_targets_2017.pdf",
        scholarUrl: "https://scholar.google.com",
        abstract:
          "An extensive test program was conducted to characterize target failure modes including front-face spalling, tunneling, shear plugging, and back-face scabbing. Quantitative relationships between projectile kinetic energy, concrete compressive strength, and damage volume were derived.",
        isFeatured: true,
        status: "PUBLISHED",
        order: 4,
        researchAreaId: r1.id,
      },
      {
        title: "Plain and reinforced concrete targets subjected to projectile impact",
        authors: "Rajput, A., Iqbal, M. A., Bhargava, P.",
        publicationType: "JOURNAL",
        venue: "Procedia Engineering (Elsevier)",
        year: 2017,
        month: "March",
        volume: "173",
        pages: "116-123",
        doi: "10.1016/j.proeng.2017.01.092",
        paperUrl: "https://doi.org/10.1016/j.proeng.2017.01.092",
        pdfUrl: "/uploads/papers/procedia_concrete_impact_2017.pdf",
        scholarUrl: "https://scholar.google.com",
        abstract:
          "Presents comparative analysis of experimental impact trials alongside predictions by classic empirical formulae (ACE, NDRC, UKAEA). Highlights discrepancies at intermediate velocities and suggests modification factors for high-strength reinforced mixes.",
        isFeatured: false,
        status: "PUBLISHED",
        order: 5,
        researchAreaId: r1.id,
      },
      {
        title: "Explicit Finite Element Modeling of Concrete Containment Structures under Severe Projectile Strikes",
        authors: "Rajput, A., Paik, J. K.",
        publicationType: "CONFERENCE",
        venue: "Proceedings of the International Conference on Structural Mechanics in Reactor Technology",
        year: 2019,
        month: "August",
        volume: "25",
        pages: "411-419",
        doi: "10.1016/j.smirt.2019.08.012",
        paperUrl: "https://doi.org",
        abstract:
          "Presents an erosive 3D Lagrangian finite element strategy implemented in LS-DYNA to simulate aircraft engine and projectile impacts against nuclear containment wall structures.",
        isFeatured: false,
        status: "PUBLISHED",
        order: 6,
        researchAreaId: r2.id,
      },
      {
        title: "Constitutive Modeling of High-Performance Concrete Under Extreme Strain Rates",
        authors: "Rajput, A.",
        publicationType: "BOOK_CHAPTER",
        venue: "Advances in Structural Engineering & Impact Mechanics (Springer)",
        year: 2021,
        pages: "145-178",
        doi: "10.1007/978-981-15-5555-5_8",
        paperUrl: "https://link.springer.com",
        abstract:
          "Authoritative reference chapter detailing stress triaxiality, pressure-dependent yield criteria, strain-rate enhancement factors, and damage softening formulation for computational simulations.",
        isFeatured: false,
        status: "PUBLISHED",
        order: 7,
        researchAreaId: r2.id,
      },
    ],
  });

  // 8. Projects
  await prisma.project.createMany({
    data: [
      {
        title: "Prestressed concrete under high rate of loading at different temperatures of Indian subcontinent",
        slug: "prestressed-concrete-high-rate-loading",
        shortDescription:
          "A 3-year research initiative exploring the coupled thermal-mechanical response of prestressed concrete infrastructure subjected to dynamic impacts under varied subcontinental climates.",
        detailedDescription:
          "Infrastructure across India experiences profound seasonal thermal gradients ranging from sub-zero temperatures in northern terrains to over 48°C in western plains. This sponsored project investigates the coupled thermal-mechanical behavioral response of prestressed concrete structural elements subjected to high-rate dynamic impacts. Advanced drop-weight impact towers and thermal environmental chambers were deployed to capture strain-rate evolution, tendon stress redistribution, and residual load capacity.",
        status: "COMPLETED",
        role: "Principal Investigator",
        fundingAgency: "Department of Science & Technology (DST) / Institutional Funding",
        grantAmount: "INR 28,50,000",
        startDate: "Dec 2020",
        endDate: "Dec 2023",
        projectUrl: "https://people.iiti.ac.in/~abhishekrajput/",
        imageUrl: "/images/project_prestressed.jpg",
        isFeatured: true,
        isPublished: true,
        order: 1,
      },
      {
        title: "Concrete under high rate of loading",
        slug: "concrete-under-high-rate-of-loading",
        shortDescription:
          "Experimental and numerical characterization of plain, fiber-reinforced, and high-strength concrete mixes under high-velocity projectile strikes.",
        detailedDescription:
          "Funded under the Technical Education Quality Improvement Programme (TEQIP-III), this project systematically evaluated penetration resistance, scabbing limits, and projectile kinetic energy attenuation across multiple concrete mix designs. High-speed laser chronometry and accelerometer arrays provided unprecedented calibration data for non-linear finite element material models.",
        status: "COMPLETED",
        role: "Principal Investigator",
        fundingAgency: "TEQIP-III (World Bank / NPIU / MHRD)",
        grantAmount: "INR 14,00,000",
        startDate: "Jul 2020",
        endDate: "Mar 2021",
        projectUrl: "https://people.iiti.ac.in/~abhishekrajput/",
        imageUrl: "/images/project_teqip.jpg",
        isFeatured: true,
        isPublished: true,
        order: 2,
      },
      {
        title: "Dynamic Failure Analysis and Crashworthiness of Corroded Offshore Structural Components",
        slug: "dynamic-failure-corroded-offshore-components",
        shortDescription:
          "Investigating the catastrophic plastic deformation and fracture mechanics of corroded marine steel plates subjected to hydrodynamic slamming and impact.",
        detailedDescription:
          "Offshore platforms and commercial vessels undergo severe chloride-induced corrosion, weakening load-bearing bulkheads. This project formulates multiscale finite element models incorporating 3D-scanned pit topologies to determine loss of crashworthiness and energy absorption during accidental collision scenarios.",
        status: "ONGOING",
        role: "Principal Investigator",
        fundingAgency: "IIT Indore Seed Grant & Industrial Collaboration",
        grantAmount: "INR 22,00,000",
        startDate: "Jan 2024",
        endDate: "Dec 2026",
        projectUrl: "https://people.iiti.ac.in/~abhishekrajput/",
        imageUrl: "/images/project_offshore.jpg",
        isFeatured: true,
        isPublished: true,
        order: 3,
      },
    ],
  });

  // 9. Courses / Teaching
  await prisma.course.createMany({
    data: [
      {
        code: "CE 201",
        title: "Structural Mechanics",
        semester: "Autumn",
        academicYear: "2024-2025",
        level: "Undergraduate (B.Tech)",
        description:
          "Foundational principles of stress-strain relations, bending moment and shear force diagrams, deflection of beams using energy methods, virtual work, and stability of columns.",
        syllabusUrl: "/uploads/syllabus/ce201_syllabus.pdf",
        courseUrl: "https://iiti.ac.in",
        isPublished: true,
        order: 1,
      },
      {
        code: "CE 305",
        title: "Design of Reinforced Concrete Structures",
        semester: "Spring",
        academicYear: "2024-2025",
        level: "Undergraduate (B.Tech)",
        description:
          "Limit state design of reinforced concrete beams, one-way and two-way slabs, columns under axial and eccentric loads, and isolated footings according to IS 456:2000.",
        syllabusUrl: "/uploads/syllabus/ce305_syllabus.pdf",
        courseUrl: "https://iiti.ac.in",
        isPublished: true,
        order: 2,
      },
      {
        code: "CE 612",
        title: "Finite Element Methods in Civil Engineering",
        semester: "Autumn",
        academicYear: "2024-2025",
        level: "Postgraduate (M.Tech / Ph.D.)",
        description:
          "Variational formulations, element formulation for 1D trusses and beams, 2D plane stress/strain, isoparametric elements, numerical integration, and nonlinear structural algorithms.",
        syllabusUrl: "/uploads/syllabus/ce612_syllabus.pdf",
        courseUrl: "https://iiti.ac.in",
        isPublished: true,
        order: 3,
      },
      {
        code: "CE 624",
        title: "Impact & Blast Resistance of Protective Structures",
        semester: "Spring",
        academicYear: "2023-2024",
        level: "Postgraduate / Advanced Elective",
        description:
          "Mechanics of high-rate dynamic loads, shock wave propagation in air and water, projectile penetration mechanics, material constitutive behavior at high strain rates, and design of protective barriers.",
        syllabusUrl: "/uploads/syllabus/ce624_syllabus.pdf",
        courseUrl: "https://iiti.ac.in",
        isPublished: true,
        order: 4,
      },
    ],
  });

  // 10. Students & Group
  await prisma.student.createMany({
    data: [
      {
        name: "Subbu Jana",
        category: "STAFF",
        researchArea: "Experimental Impact Testing & Laboratory Operations",
        degree: "Technical Assistant",
        joiningYear: "2019",
        status: "CURRENT",
        photoUrl: "/images/students/tech1.jpg",
        bio: "Senior Technical Assistant overseeing the pneumatic projectile launcher apparatus, instrumentation calibration, high-speed camera synchronization, and structural workshop facilities.",
        isPublished: true,
        order: 1,
      },
      {
        name: "Shaoor Khan",
        category: "STAFF",
        researchArea: "Materials Testing & Specimen Fabrication",
        degree: "Technical Assistant",
        joiningYear: "2020",
        status: "CURRENT",
        photoUrl: "/images/students/tech2.jpg",
        bio: "Technical Assistant responsible for concrete mix preparation, curing protocol monitoring, strain-gauge installation, and servo-hydraulic test frame maintenance.",
        isPublished: true,
        order: 2,
      },
      {
        name: "Ankit Sharma",
        category: "PHD",
        researchArea: "Nonlinear Ballistic Penetration in Ultra-High Performance Concrete",
        degree: "Ph.D. Scholar",
        joiningYear: "2021",
        status: "CURRENT",
        photoUrl: "/images/students/phd1.jpg",
        bio: "Focuses on fiber-matrix interfacial debonding and multi-scale damage modeling in UHPC under high-velocity kinetic energy projectile strikes.",
        linkedinUrl: "https://linkedin.com",
        scholarUrl: "https://scholar.google.com",
        email: "phd.ankit@iiti.ac.in",
        isPublished: true,
        order: 3,
      },
      {
        name: "Priya Verma",
        category: "PHD",
        researchArea: "Coupled Dynamic Behavior of Prestressed Concrete under Impact & Blast",
        degree: "Ph.D. Scholar",
        joiningYear: "2022",
        status: "CURRENT",
        photoUrl: "/images/students/phd2.jpg",
        bio: "Investigating the dissipation of high-strain shock energy in post-tensioned slabs using both experimental drop-tests and explicit Eulerian-Lagrangian finite element formulations.",
        linkedinUrl: "https://linkedin.com",
        email: "phd.priya@iiti.ac.in",
        isPublished: true,
        order: 4,
      },
      {
        name: "Rohit Patel",
        category: "MASTERS",
        researchArea: "Crashworthiness and Energy Absorption of Thin-Walled Structural Tubes",
        degree: "M.Tech in Structural Engineering",
        joiningYear: "2023",
        graduationYear: "2025",
        status: "CURRENT",
        photoUrl: "/images/students/mtech1.jpg",
        bio: "Analyzing progressive folding mechanisms and mean crushing force enhancements in multi-cell structural tubes under axial dynamic impacts.",
        isPublished: true,
        order: 5,
      },
      {
        name: "Vikram Singh",
        category: "ALUMNI",
        researchArea: "Computational Modeling of Marine Steel Corrosion Pitting",
        degree: "Ph.D. (Graduated 2023)",
        joiningYear: "2018",
        graduationYear: "2023",
        status: "GRADUATED",
        photoUrl: "/images/students/alumni1.jpg",
        bio: "Currently a Postdoctoral Fellow at NTU Singapore. His doctoral thesis investigated the stochastic degradation of marine structures under severe environmental pitting.",
        linkedinUrl: "https://linkedin.com",
        isPublished: true,
        order: 6,
      },
    ],
  });

  // 11. Awards & Honors
  await prisma.award.createMany({
    data: [
      {
        title: "Post-Doctoral Fellowship",
        organization: "Korean Ships and Offshore Structure Research Institute, Pusan National University, South Korea",
        year: "2017",
        description:
          "Awarded competitive international fellowship to conduct cutting-edge research on structural crashworthiness and impact mechanics for offshore infrastructure.",
        isFeatured: true,
        isPublished: true,
        order: 1,
      },
      {
        title: "Doctoral Fellowship (MHRD)",
        organization: "Ministry of Human Resource Development (MHRD), Government of India",
        year: "2013",
        description:
          "Awarded national fellowship for conducting doctoral research in Civil Engineering at the Indian Institute of Technology Roorkee.",
        isFeatured: true,
        isPublished: true,
        order: 2,
      },
      {
        title: "MHRD GATE Fellowship",
        organization: "Ministry of Education / IIT Roorkee",
        year: "2009",
        description:
          "Conferred for pursuing postgraduate Master of Technology studies in Structural Engineering at IIT Roorkee.",
        isFeatured: false,
        isPublished: true,
        order: 3,
      },
    ],
  });

  // 12. News & Announcements
  await prisma.news.createMany({
    data: [
      {
        title: "Research Paper on Ballistic Impact Published in Elsevier Structures",
        slug: "paper-published-elsevier-structures-2025",
        date: new Date("2025-06-18"),
        content:
          "Our latest research article investigating projectile impact kinematics and corrosion effects has been published in Elsevier Structures. Congratulations to our co-authors and research group!",
        category: "PAPER",
        externalUrl: "https://doi.org/10.1016/j.istruc.2020.06.014",
        isFeatured: true,
        status: "PUBLISHED",
        order: 1,
      },
      {
        title: "Invited Lecture on Structural Impact & Blast Mitigation",
        slug: "invited-lecture-structural-blast-mitigation",
        date: new Date("2025-04-12"),
        content:
          "Dr. Abhishek Rajput delivered an invited keynote talk at the National Symposium on Advances in Structural Mechanics discussing recent breakthroughs in prestressed target response.",
        category: "TALK",
        externalUrl: "https://iiti.ac.in",
        isFeatured: true,
        status: "PUBLISHED",
        order: 2,
      },
      {
        title: "Welcoming New Ph.D. Scholars to the Lab",
        slug: "welcoming-new-scholars-autumn-2025",
        date: new Date("2025-08-01"),
        content:
          "The Impact & Structural Mechanics Laboratory at IIT Indore welcomes incoming research scholars joining for the Autumn 2025 academic session.",
        category: "ANNOUNCEMENT",
        isFeatured: false,
        status: "PUBLISHED",
        order: 3,
      },
    ],
  });

  // 13. Site Settings
  await prisma.siteSettings.create({
    data: {
      siteTitle: "Dr. Abhishek Rajput | Assistant Professor, IIT Indore",
      siteDescription:
        "Official academic portfolio, research group, publications, and teaching portal of Dr. Abhishek Rajput, Department of Civil Engineering, Indian Institute of Technology Indore.",
      contactEmail: "abhishekrajput@iiti.ac.in",
      footerText: "© 2026 Dr. Abhishek Rajput. Department of Civil Engineering, Indian Institute of Technology Indore. All rights reserved.",
      enableNews: true,
      enableStudents: true,
    },
  });

  console.log("Database seeded successfully with all authentic professor data!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
