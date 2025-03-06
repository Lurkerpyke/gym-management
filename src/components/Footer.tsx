import React from 'react'

const Footer = () => {
  return (
      <footer className="border-t z-40 bg-secondary text-secondary-foreground w-full items-center flex justify-center">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 px-4 md:h-24 md:flex-row md:py-0 md:px-6">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <p className="text-center text-sm leading-loose md:text-left">
                      Built by GymPro. Build a strong healthy body.
                  </p>
              </div>
              <p className="text-center text-sm md:text-left">© 2025 GymPro. All rights reserved.</p>
          </div>
      </footer>
  )
}

export default Footer