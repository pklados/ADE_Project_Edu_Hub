
import React from 'react';

interface CoursesProps {
  onBack: () => void;
}

const Courses: React.FC<CoursesProps> = ({ onBack }) => {
  const courses = [
    {
      id: 'ΕΕΕ.7-3.7',
      title: 'VLSI Design',
      instructor: 'Patsis Giorgos',
      credits: 5,
      icon: 'fa-microchip',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      id: 'ΕΕΕ.7-3.2',
      title: 'Control Systems II',
      instructor: 'Kandris Xenophon',
      credits: 5,
      icon: 'fa-sliders',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'EEE.7-3.1',
      title: 'Microprocessors',
      instructor: 'Kaltsas Gregory',
      credits: 5,
      icon: 'fa-memory',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'EEE.7-3.3',
      title: 'Digital Signal Processing',
      instructor: 'Maria Ragkousi',
      credits: 5,
      icon: 'fa-wave-square',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="w-full max-w-5xl space-y-6 animate-fadeIn py-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Current Semester Courses</h1>
          <p className="text-slate-500 text-sm">Manage your academic curriculum and course materials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div 
            key={course.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-5 hover:border-indigo-200 transition-colors"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${course.color}`}>
              <i className={`fas ${course.icon} text-2xl`}></i>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{course.id}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{course.credits} Credits</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4">Instructor: {course.instructor}</p>
              
              <div className="flex gap-2">
                <button className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors">
                  Course Material
                </button>
                <button className="text-xs font-bold px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                  Syllabus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Stats Placeholder */}
      <section className="bg-slate-900 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-1">180</div>
            <div className="text-slate-400 text-xs uppercase font-bold tracking-widest">Total Credits</div>
          </div>
          <div className="text-center sm:border-x sm:border-slate-800">
            <div className="text-3xl font-bold text-emerald-400 mb-1">7.1</div>
            <div className="text-slate-400 text-xs uppercase font-bold tracking-widest">Grade avg</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">12</div>
            <div className="text-slate-400 text-xs uppercase font-bold tracking-widest">Weeks Remaining</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
